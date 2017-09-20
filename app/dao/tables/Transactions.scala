package dao.tables

import java.time.LocalDateTime

import dao.mappers.LocalDateMapper._
import models.Transaction
import slick.driver.PostgresDriver.api._
import slick.lifted._

/**
  * Maps Transaction entity to the SQL table.
  */
class Transactions(tag: Tag) extends Table[Transaction](tag, "tx") {
  def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
  def timestamp = column[LocalDateTime]("ts")
  def comment = column[Option[String]]("comment")
  def * =
    (id.?, timestamp, comment) <> ((Transaction.apply _).tupled, Transaction.unapply)
}

class TagMap(tag: Tag) extends Table[(Long, Long)](tag, "tx_tags") {
  def tag_id = column[Long]("tag_id")
  def tx_id = column[Long]("tx_id")
  def * = (tag_id, tx_id)
}
