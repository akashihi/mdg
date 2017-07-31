package dao

import java.sql.Date
import java.time.LocalDate

import dao.tables.Budgets.localDtoDate
import dao.BudgetEntryDao._
import dao.tables._
import models.Budget
import slick.driver.PostgresDriver.api._

import play.api.libs.concurrent.Execution.Implicits._

object BudgetDao {
  val budgets = TableQuery[Budgets]

  /**
    * Calculates remains on asset accounts for specified date.
    * @param term_beginning date on which remain is calculated
    * @return remains on that date
    */
  def getIncomingAmount(term_beginning: LocalDate): DBIO[BigDecimal] = {
    val dt = Date.valueOf(term_beginning)
    sql"select sum(o.amount) from operation as o, account as a, tx where o.account_id=a.id and o.tx_id=tx.id and a.account_type='asset' and a.hidden='f' and tx.ts < ${dt}"
      .as[Option[BigDecimal]]
      .map(_.head)
      .map(_.getOrElse(BigDecimal(0)))
  }

  /**
    * Calculates, how budget is expected to change remains on asset accounts.
    * @param budget_id budget to estimate
    * @param relatedAccounts limit budget changes to specified accounts ids list
    * @return estimated remains delta.
    */
  def getExpectedChange(budget_id: Long, relatedAccounts: Seq[Long]): DBIO[BigDecimal] = {
    entries
      .filter(_.budget_id === budget_id)
      .filter(_.account_id inSet relatedAccounts)
      .map(_.expected_amount)
      .sum
      .result
      .map(_.getOrElse(BigDecimal(0)))
  }

  /**
    * Looks for a budgets, that overlap with specified period.
    * @param term_beginning period first day
    * @param term_end period last day
    * @return first found overlapping budget
    */
  def findOverlapping(term_beginning: LocalDate,
                      term_end: LocalDate): DBIO[Option[Budget]] = {
    budgets
      .filter(b =>
        b.term_beginning <= term_end && b.term_end >= term_beginning)
      .take(1)
      .result
      .headOption
  }

  /**
    * Adds budget to the database.
    * @param b budget to add.
    * @return Nwely added budget with id specified.
    */
  def insert(b: Budget): DBIO[Budget] = budgets returning budgets += b

  /**
    * Returns all known budgets.
    * @return list o budgets.
    */
  def list(): DBIO[Seq[Budget]] = budgets.result

  /**
    * Finds budget by its id.
    * @param id Budget to look for.
    * @return matching budget object.
    */
  def find(id: Long): DBIO[Option[Budget]] = {
    budgets.filter(_.id <= id).sortBy(_.id.desc).take(1).result.headOption
  }

  /**
    * Removes budget from the database
    * @param id Budget id to remove
    * @return Number of removed budgets
    */
  def delete(id: Long): DBIO[Int] = budgets.filter(_.id === id).delete
}
