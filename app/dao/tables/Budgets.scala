package dao.tables

import java.sql.Date
import java.time.LocalDate

import models.Budget
import slick.driver.PostgresDriver.api._
import slick.lifted._

/**
  * Maps Budget entity to the SQL table.
  */
class Budgets(tag: Tag) extends Table[Budget](tag, "budget") {
  implicit val localDtoDate = Budgets.localDtoDate

  def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
  def term_beginning = column[LocalDate]("term_beginning")
  def term_end = column[LocalDate]("term_beginning")
  def * = (id.?, term_beginning, term_end) <> ((Budget.apply _).tupled, Budget.unapply)
}

object Budgets {
  implicit val localDtoDate = MappedColumnType.base[LocalDate, Date] (
    l => Date.valueOf(l),
    d => d.toLocalDate
  )
}
