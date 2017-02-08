package dao

import javax.inject._

import dao.tables.{Operations, TagMap, Tags, Transactions}
import models.{Operation, Transaction, TxTag}
import play.api.db.slick._
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent._

class TransactionDao @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  val db = dbConfigProvider.get[JdbcProfile].db
  val transactions = TableQuery[Transactions]
  val operations = TableQuery[Operations]
  val tags = TableQuery[Tags]
  val tagMaps = TableQuery[TagMap]

  def insert(tx: Transaction, ops: Seq[Operation], txtags: Seq[TxTag]): Future[Transaction] = {
    val query = (for {
      txId <- transactions returning transactions.map(_.id) += tx
      _ <- operations ++= ops.map(x => x.copy(txId = txId))
      _ <- tagMaps ++= txtags.map(x => (x.id, txId))
    } yield tx.copy(id = txId)).transactionally
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

  def list(): Future[Seq[Transaction]] = {
    db.run(transactions.result)
  }
}
