package dao.queries

import dao.queries.TransactionQuery._
import dao.tables.BudgetEntries
import models.{Budget, BudgetEntry, IncomeAccount}
import play.api.libs.concurrent.Execution.Implicits._
import slick.jdbc.PostgresProfile.api._

object BudgetEntryQuery {
  val entries = TableQuery[BudgetEntries]

  /**
    * Returns entries linked to specified budget.
    * @param budget_id Identity of a budget.
    * @return Seq of BudgetEntries
    */
  def list(budget_id: Long): DBIO[Seq[BudgetEntry]] =
    entries.filter(_.budget_id === budget_id).result

  /**
    * Looks for a budget entry.
    * @param id Entry id
    * @param budget_id Identity of the owning budget.
    * @return BudgetEntry object or None if not found.
    */
  def find(id: Long, budget_id: Long): DBIO[Option[BudgetEntry]] =
    entries.filter(_.id === id).result.headOption

  /**
    * Updates database with the specified BudgetEntry.
    * @param entry enytr to save in db.
    * @return 1 if entry successfully updates, any other value in case of failures.
    */
  def update(entry: BudgetEntry): DBIO[Int] =
    entries.filter(_.id === entry.id).update(entry)

  /**
    * Calculates actual totals for specified account
    * during validity period of the specified budget.
    * @param account_id account in interest.
    * @param budget budget to filter on
    * @return Sum of all operations on the specified account.
    */
  def getActualSpendings(account_id: Long, budget: Budget): DBIO[BigDecimal] = {
    transactionsForPeriod(budget.term_beginning, budget.term_end).flatMap {
      txId =>
        val value = operations
          .filter(_.tx_id inSet txId)
          .filter(_.account_id === account_id)
          .map(_.amount)
          .sum
          .result

        AccountQuery.findById(account_id).flatMap { acc =>
          value.map { a =>
            val amount = a.getOrElse(BigDecimal(0))
            acc match {
              case None => amount
              case Some(x) =>
                if (x.account_type == IncomeAccount) -amount else amount
            }
          }
        }
    }
  }
}
