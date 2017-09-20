package dao.tables

import java.time.LocalDateTime

import dao.mappers.LocalDateMapper._
import models.Rate
import slick.driver.PostgresDriver.api._
import slick.lifted._

/**
  * Maps Rate entity to the SQL table.
  */
class Rates(tag: Tag) extends Table[Rate](tag, "rates") {
  def id = column[Long]("id", O.PrimaryKey)
  def beginning = column[LocalDateTime]("rate_beginning")
  def end = column[LocalDateTime]("rate_end")
  def from_currency = column[Long]("from_id")
  def to_currency = column[Long]("to_id")
  def rate = column[BigDecimal]("rate")
  def * =
    (id.?, beginning, end, from_currency, to_currency, rate) <> ((Rate.apply _).tupled, Rate.unapply)
}
