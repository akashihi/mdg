package dao

import java.time.LocalDate

import dao.filters.TransactionFilter
import dao.ordering.{Asc, Desc, Page, SortBy}
import dao.tables.Transactions._
import dao.tables.{Operations, TagMap, Tags, Transactions}
import models.{Operation, Transaction, TxTag}
import play.api.libs.concurrent.Execution.Implicits._
import slick.dbio.DBIOAction
import slick.dbio.Effect.All
import slick.driver.PostgresDriver.api._

/**
  * Database actions for Transactions.
  */
object TransactionDao {
  val transactions = TableQuery[Transactions]
  val operations = TableQuery[Operations]
  val tagMaps = TableQuery[TagMap]
  val tags = TagDao.tags

  /**
    * Filtering helper. Retrieves list of transactions ids,
    * which are tagged with specified tags.
    * @param filter List of tags
    * @return List of transactions id, wrapped to DBIO
    */
  def tagTxFilter(filter: Option[Seq[String]]): DBIO[Seq[Long]] = {
    filter
      .map { f =>
        tags
          .filter(_.txtag inSet f)
          .map(_.id)
          .result
          .flatMap(tag_ids => {
            tagMaps.filter(_.tag_id inSet tag_ids.flatten).map(_.tx_id).result
          })
      }
      .getOrElse(DBIO.successful(Seq.empty[Long]))
  }

  /**
    * Filtering helper. Retrieves list of transactions ids,
    * which have operations on the specified acocunt ids
    * @param filter List of tags
    * @return List of transactions id, wrapped to DBIO
    */
  def accTxFilter(filter: Option[Seq[Long]]): DBIO[Seq[Long]] = {
    filter
      .map { a =>
        operations.filter(_.account_id inSet a).map(_.tx_id).result
      }
      .getOrElse(DBIO.successful(Seq.empty[Long]))
  }

  /**
    * Adds transaction to the database
    * @param tx transaction object to add
    * @param ops transaction operations list
    * @param txtags transaction tag list
    * @return Newly created transaction object with id
    */
  def insert(tx: Transaction,
             ops: Seq[Operation],
             txtags: Seq[TxTag]): DBIO[Transaction] = {
    (for {
      txId <- tx.id match {
        case None => transactions returning transactions.map(_.id) += tx
        case Some(txId) =>
          transactions returning transactions.map(_.id) forceInsert tx
      }
      _ <- operations ++= ops.map(x => x.copy(txId = txId))
      _ <- tagMaps ++= txtags.map(x => (x.id.get, txId))
    } yield tx.copy(id = Some(txId))).transactionally
  }

  /**
    * Converts a Transaction filter specification to the Slick query definition.
    * @param filter Filter to work on.
    * @return Slick query, configured to match supplied filter.
    */
  private def makeCriteria(filter: TransactionFilter): DBIO[Query[Transactions, Transaction, Seq]] = {
    val preActions = TransactionDao.tagTxFilter(filter.tag) zip TransactionDao
      .accTxFilter(filter.account_id)

    preActions.map(tx_id_s => {
      val (tag_tx_s, acc_tx_s) = tx_id_s

      //We need tag_tx_s and acc_tx_s lists
      //to be applied conditionally, depending
      //on presence of list contents

      val tag_tx = Option(tag_tx_s).filter(_.nonEmpty)
      val acc_tx = Option(acc_tx_s).filter(_.nonEmpty)

      transactions.filter {
        t =>
          List(
            filter.comment.map(t.comment.getOrElse("") === _),
            filter.notEarlier.map(t.timestamp >= _),
            filter.notLater.map(t.timestamp <= _),
            tag_tx.map(t.id inSet _),
            acc_tx.map(t.id inSet _)
          ).collect({ case Some(x) => x })
            .reduceLeftOption(_ && _)
            .getOrElse(true: Rep[Boolean])
      }
  })
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
  def list(filter: TransactionFilter,
           sort: Seq[SortBy],
           page: Option[Page]): DBIO[Seq[Transaction]] = {
      makeCriteria(filter).flatMap { criteriaQuery =>
        val sortedQuery =
          sort.headOption.getOrElse(SortBy("timestamp", Desc)) match {
            case SortBy("timestamp", Asc) =>
              criteriaQuery.sortBy(_.timestamp.asc)
            case _ => criteriaQuery.sortBy(_.timestamp.desc)
          }

        val pagedQuery = page match {
          case Some(p) => sortedQuery.drop(p.size * (p.no - 1)).take(p.size)
          case None => sortedQuery
        }

        pagedQuery.result
      }
  }

  /**
    * Counts number of transactions, matching
    * specified filter.
    * @param filter Transaction filter description.
    * @return Number pof matched transactions.
    */
  def count(filter: TransactionFilter): DBIO[Int] = makeCriteria(filter).flatMap(_.length.result)

  /**
    * Retrieves transaction by it's id.
    * @param id Transaction id to find.
    * @return Transaction from the database.
    */
  def findById(id: Long): DBIO[Option[Transaction]] = {
    transactions.filter(_.id === id).result.headOption
  }

  /**
    * Retrieves transaction's tags
    * @param txId transaction id to work on
    * @return list of transaction's tags
    */
  def listTags(txId: Long): DBIO[Seq[TxTag]] = {
    val query = for {
      t <- tagMaps if t.tx_id === txId
      tt <- tags if tt.id === t.tag_id
    } yield tt
    query.result
  }

  /**
    * Retrieves transaction's operations.
    * @param txId transaction id to work on
    * @return list of transaction's operations
    */
  def listOperations(txId: Long): DBIO[Seq[Operation]] = operations.filter(_.tx_id === txId).result

  /**
    * Retrieves operations of specified transactions.
    * @param txId transactions ids to work on
    * @return list of operations
    */
  def listOperations(txId: Seq[Long]): DBIO[Seq[Operation]] = operations.filter(_.tx_id inSet txId).result

  /**
    * Retrieves ids of transactions, logged between specified dates.
    * @param term_beginning Beginning of period, inclusive
    * @param term_end End of period, exclusive
    * @return Sequence of mathcing transaction's ids, wrapped to DBIO
    */
  def transactionsForPeriod(term_beginning: LocalDate,
                            term_end: LocalDate): DBIO[Seq[Long]] = {
    transactions
      .filter(_.timestamp >= term_beginning.atStartOfDay())
      .filter(_.timestamp < term_end.plusDays(1).atStartOfDay())
      .map(_.id)
      .result
  }

  /**
    * Removes transaction from the database.
    * @param id Transaction id to remove.
    * @return Number of removed transactions.
    */
  def delete(id: Long): DBIO[Int] = transactions.filter(_.id === id).delete
}
