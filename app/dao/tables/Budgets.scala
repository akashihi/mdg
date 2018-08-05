package dao.tables

import java.time.LocalDate

import dao.mappers.LocalDateMapper._
import models.Budget
import slick.jdbc.PostgresProfile.api._
import slick.lifted._

/**
  * Maps Budget entity to the SQL table.
  */
class Budgets(tag: Tag) extends Table[Budget](tag, "budget") {
  def id = column[Long]("id", O.PrimaryKey)
  def term_beginning = column[LocalDate]("term_beginning")
  def term_end = column[LocalDate]("term_end")
  def * =
    (id.?, term_beginning, term_end) <> ((Budget.apply _).tupled, Budget.unapply)
}
