package dao.tables

import models.Operation
import slick.jdbc.PostgresProfile.api._
import slick.lifted._

/**
  * Maps Operation entity to the SQL table.
  */
class Operations(tag: Tag) extends Table[Operation](tag, "operation") {
  def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
  def tx_id = column[Long]("tx_id")
  def account_id = column[Long]("account_id")
  def amount = column[BigDecimal]("amount")
  def rate = column[BigDecimal]("rate")
  def * =
    (id, tx_id, account_id, amount, rate) <> ((Operation.apply _).tupled, Operation.unapply)
}
