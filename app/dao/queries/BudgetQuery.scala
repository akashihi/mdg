package dao.queries

import java.time.LocalDate

import dao.queries.BudgetEntryQuery._
import dao.tables._
import models.{Budget, BudgetEntry}
import slick.jdbc.PostgresProfile.api._
import dao.mappers.LocalDateMapper._

object BudgetQuery {
  val budgets = TableQuery[Budgets]

  /**
    * Calculates, how budget is expected to change remains on asset accounts.
    * @param budget_id budget to estimate
    * @param relatedAccounts limit budget changes to specified accounts ids list
    * @return estimated remains delta.
    */
  def getExpectedChange(budget_id: Long,
                        relatedAccounts: Seq[Long]): DBIO[Seq[BudgetEntry]] = {
    entries
      .filter(_.budget_id === budget_id)
      .filter(_.account_id inSet relatedAccounts)
      .result
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
  def list(): StreamingDBIO[Seq[Budget], Budget] = budgets.sortBy(_.term_beginning.desc).result

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
