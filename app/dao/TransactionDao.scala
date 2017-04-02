package dao

import javax.inject._

import dao.filters.TransactionFilter
import dao.ordering.{Asc, Desc, Page, SortBy}
import dao.tables.{Operations, TagMap, Tags, Transactions}
import dao.tables.Transactions._
import models.{Operation, Transaction, TxTag}
import play.api.db.slick._
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent._
import scala.concurrent.duration._

class TransactionDao @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  val db = dbConfigProvider.get[JdbcProfile].db
  val transactions = TableQuery[Transactions]
  val operations = TableQuery[Operations]
  val tags = TableQuery[Tags]
  val tagMaps = TableQuery[TagMap]

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

  def listOperations(txId: Long): Future[Seq[Operation]] = {
    db.run(operations.filter(_.tx_id === txId).result)
  }

  def listTags(txId: Long): Future[Seq[TxTag]] = {
    val query = for {
      t <- tagMaps if t.tx_id === txId
      tt <- tags if tt.id === t.tag_id
    } yield tt
    db.run(query.result)
  }

  def list(filter: TransactionFilter, sort: Seq[SortBy], page: Option[Page]): Future[Seq[Transaction]] = {
    val tag_tx_action = filter.tag.map { f=>
      tags.filter(_.txtag inSet f).map(_.id).result.flatMap(tag_ids => {
        tagMaps.filter(_.tag_id inSet tag_ids).map(_.tx_id).result
      })
    }.getOrElse(DBIO.successful(Seq.empty[Long]))

    val acc_tx_action = filter.account_id.map { a=>
      operations.filter(_.account_id inSet  a).map(_.tx_id).result
    }.getOrElse(DBIO.successful(Seq.empty[Long]))

    val preActions = tag_tx_action zip acc_tx_action


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

  def findById(id: Long): Future[Option[Transaction]] = {
    db.run(transactions.filter(_.id === id).result.headOption)
  }

  def delete(id: Long): Future[Option[Int]] = {
    db.run(transactions.filter(_.id === id).delete).map {
      case 1 => Some(1)
      case _ => None
    }
  }
}
