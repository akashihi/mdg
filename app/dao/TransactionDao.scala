package dao

import java.time.LocalDate
import javax.inject._

import dao.filters.TransactionFilter
import dao.ordering.{Asc, Desc, Page, SortBy}
import dao.tables.Transactions._
import dao.tables.{Operations, TagMap, Tags, Transactions}
import models.{Operation, Transaction, TxTag}
import play.api.db.slick._
import slick.dbio.DBIOAction
import slick.dbio.Effect.Read
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._
import slick.profile._

import scala.concurrent._

/**
  * Database access for Transactions.
  * @param dbConfigProvider external database provider
  * @param ec external ExecutionContext provider
  */
class TransactionDao @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  val db = dbConfigProvider.get[JdbcProfile].db
  val transactions = TransactionDao.transactions
  val operations = TransactionDao.operations
  val tags = TableQuery[Tags]
  val tagMaps = TableQuery[TagMap]

  /**
    * Adds transaction to the database
    * @param tx transaction object to add
    * @param ops transaction operations list
    * @param txtags transaction tag list
    * @return Newly created transaction object with id
    */
  def insert(tx: Transaction, ops: Seq[Operation], txtags: Seq[TxTag]): Future[Transaction] = {
    val query = (for {
      txId <- tx.id match {
        case None => transactions returning transactions.map(_.id) += tx
        case Some(txId) => transactions returning transactions.map(_.id) forceInsert  tx
      }
      _ <- operations ++= ops.map(x => x.copy(txId = txId))
      _ <- tagMaps ++= txtags.map(x => (x.id, txId))
    } yield tx.copy(id = Some(txId))).transactionally
    db.run(query)
  }

  /**
    * Retrieves transaction's operations.
    * @param txId transaction id to work on
    * @return list of transaction's operations
    */
  def listOperations(txId: Long): Future[Seq[Operation]] = {
    db.run(operations.filter(_.tx_id === txId).result)
  }

  /**
    * Retrieves transaction's tags
    * @param txId transaction id to work on
    * @return list of transaction's tags
    */
  def listTags(txId: Long): Future[Seq[TxTag]] = {
    val query = for {
      t <- tagMaps if t.tx_id === txId
      tt <- tags if tt.id === t.tag_id
    } yield tt
    db.run(query.result)
  }

  /**
    * Filtering helper. Retrieves list of transactions ids,
    * which are tagged with specified tags.
    * @param filter List of tags
    * @return List of transactions id, wrapped to DBIO
    */
  private def tagTxAction(filter: Option[Seq[String]]): DBIOAction[Seq[Long], NoStream, Read with Read] = {
    filter.map { f=>
      tags.filter(_.txtag inSet f).map(_.id).result.flatMap(tag_ids => {
        tagMaps.filter(_.tag_id inSet tag_ids).map(_.tx_id).result
      })
    }.getOrElse(DBIO.successful(Seq.empty[Long]))
  }

  /**
    * Filtering helper. Retrieves list of transactions ids,
    * which have operations on the specified acocunt ids
    * @param filter List of tags
    * @return List of transactions id, wrapped to DBIO
    */
  private def accTxAction(filter: Option[Seq[Long]]) = {
    filter.map { a=>
      operations.filter(_.account_id inSet  a).map(_.tx_id).result
    }.getOrElse(DBIO.successful(Seq.empty[Long]))
  }

  /**
    * Retrieves list of transaction, according to the
    * specified filter and ordering. List of transaction could be
    * paginated.
    * @param filter Transaction filter description.
    * @param sort Ordering destription.
    * @param page Pagination specification.
    * @return List of mathed transactions.
    */
  def list(filter: TransactionFilter, sort: Seq[SortBy], page: Option[Page]): Future[Seq[Transaction]] = {
    val preActions = tagTxAction(filter.tag) zip accTxAction(filter.account_id)


    val query = preActions.flatMap(tx_id_s => {
      val (tag_tx_s, acc_tx_s) = tx_id_s

      //We need tag_tx_s and acc_tx_s lists
      //to be applied conditionally, depending
      //on presence of list contents

      val tag_tx = Option(tag_tx_s).filter(_.nonEmpty)
      val acc_tx = Option(acc_tx_s).filter(_.nonEmpty)

      val criteriaQuery = transactions.filter { t  =>
        List(
          filter.comment.map(t.comment.getOrElse("") === _),
          filter.notEarlier.map(t.timestamp >= _),
          filter.notLater.map(t.timestamp <= _),
          tag_tx.map(t.id inSet _),
          acc_tx.map(t.id inSet _)
        ).collect({ case Some(x) => x }).reduceLeftOption(_ && _).getOrElse(true: Rep[Boolean])
      }

      val sortedQuery = sort.headOption.getOrElse(SortBy("timestamp", Desc)) match {
        case SortBy("timestamp", Asc) => criteriaQuery.sortBy(_.timestamp.asc)
        case _ => criteriaQuery.sortBy(_.timestamp.desc)
      }

      val pagedQuery = page match {
        case Some(p) => sortedQuery.drop(p.size*(p.no-1)).take(p.size)
        case None => sortedQuery
      }

      pagedQuery.result
    })

    db.run(query)
  }

  /**
    * Retrieves transaction by it's id.
    * @param id Transaction id to find.
    * @return Transaction from the database.
    */
  def findById(id: Long): Future[Option[Transaction]] = {
    db.run(transactions.filter(_.id === id).result.headOption)
  }

  /**
    * Removes transaction from the database.
    * @param id Transaction id to remove.
    * @return Number of removed transactions.
    */
  def delete(id: Long): Future[Option[Int]] = {
    db.run(transactions.filter(_.id === id).delete).map {
      case 1 => Some(1)
      case _ => None
    }
  }
}

object TransactionDao {
  val transactions = TableQuery[Transactions]
  val operations = TableQuery[Operations]

  def transactionsForPeriod(term_beginning: LocalDate, term_end: LocalDate): FixedSqlStreamingAction[Seq[Long], Long, Read] = {
    transactions.filter(_.timestamp >= term_beginning.atStartOfDay()).filter(_.timestamp < term_end.plusDays(1).atStartOfDay()).map(_.id).result
  }
}
