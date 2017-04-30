package dao.tables

import models.BudgetEntry
import slick.driver.PostgresDriver.api._
import slick.lifted._

/**
  * Maps Budget entity to the SQL table.
  */
class BudgetEntries(tag: Tag) extends Table[BudgetEntry](tag, "budgetentry") {
  implicit val localDtoDate = Budgets.localDtoDate

  def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
  def budget_id = column[Long]("budget_id")
  def account_id = column[Long]("account_id")
  def even_distribution = column[Boolean]("even_distribution")
  def proration = column[Option[Boolean]]("proration")
  def expected_amount = column[BigDecimal]("expected_amount")
  def * =
    (id.?,
     budget_id,
     account_id,
     even_distribution,
     proration,
     expected_amount) <> ((BudgetEntry.apply _).tupled, BudgetEntry.unapply)
}
