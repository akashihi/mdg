package services

import java.time.LocalDate

import controllers.dto.BudgetDTO
import dao.filters.EmptyAccountFilter
import dao.BudgetDao
import models.{Account, Budget}
import slick.driver.PostgresDriver.api._
import util.EitherD
import util.EitherD._
import validators.Validator._

import scalaz._
import Scalaz._
import play.api.libs.concurrent.Execution.Implicits._

/**
  * Budget operations service.
  */
object BudgetService {

  /**
    * Calculates actual change of remains on asset account during
    * budget validity period.
    * @param b period first day.
    * @return actual remains delta during that period.
    */
  private def getActualSpendings(
      b: Budget,
      incomeAccounts: Seq[Account],
      expenseAccounts: Seq[Account]): DBIO[(BigDecimal, BigDecimal)] = {
    val getTotalsForBudget =
      TransactionService.getTotalsForDate(b.term_beginning, b.term_end) _
    getTotalsForBudget(incomeAccounts).map(-_) zip getTotalsForBudget(
      expenseAccounts)
  }

  /**
    * Calculates, how balances on specified accounts changed today.
    * @param accounts accounts to look on.
    * @return sum of amounts of all operations on specified accounts today.
    */
  private def getTodaySpendings(accounts: Seq[Account]): DBIO[BigDecimal] = {
    val today = LocalDate.now()
    TransactionService.getTotalsForDate(today, today)(accounts)
  }

  private def getAllowedSpendings(b: Budget): DBIO[BigDecimal] = {
    BudgetEntryService
      .list(b.id.get)
      .map(_.flatMap(_.change_amount).foldLeft(BigDecimal(0))(_ + _))
  }

  /**
    * Calculates budget estimated remains change.
    * @param b budget to estimate.
    * @return expected change, actual change.
    */
  def getExpectedChange(
      b: Budget,
      incomeAccounts: Seq[Long],
      expenseAccounts: Seq[Long]): DBIO[(BigDecimal, BigDecimal)] = {
    b.id
      .map(
        x =>
          BudgetDao.getExpectedChange(x, incomeAccounts) zip BudgetDao
            .getExpectedChange(x, expenseAccounts))
      .getOrElse(DBIO.successful((BigDecimal(0), BigDecimal(0))))
  }

  /**
    * Converts Budget object to the DTO
    * @param b budget object to convert
    * @return Fully filled DTO object
    */
  def budgetToDTO(b: Budget): DBIO[BudgetDTO] = {
    AccountService.listSeparate(EmptyAccountFilter).flatMap { a =>
      val (incomeAccounts, _, expenseAccounts) = a

      BudgetDao.getIncomingAmount(b.term_beginning).flatMap { incoming =>
        getExpectedChange(b,
                          incomeAccounts.flatMap(_.id),
                          expenseAccounts.flatMap(_.id)).flatMap {
          expectedChange =>
            val (expectedIncome, expectedExpense) = expectedChange
            getActualSpendings(b, incomeAccounts, expenseAccounts).flatMap {
              spendings =>
                val (income, expense) = spendings
                getTodaySpendings(expenseAccounts).flatMap { todaySpendings =>
                  getAllowedSpendings(b).map { todayChange =>
                    BudgetDTO
                      .builder()
                      .withBudget(b)
                      .withIncoming(incoming)
                      .withIncome(income)
                      .withExpense(expense)
                      .withExpectedIncome(expectedIncome)
                      .withExpectedExpense(expectedExpense)
                      .withStateChange(todayChange, todaySpendings)
                      .build()
                  }
                }
            }
        }
      }
    }
  }

  /**
    * Creates new budget.
    * @param budget budget description object.
    * @return budget description object with id.
    */
  def add(budget: Option[Budget]): EitherD[String, BudgetDTO] = {
    val v = budget
      .fromOption("BUDGET_DATA_INVALID")
      .map { validate }
      .flatMap { validationToXor }
      .map(x =>
        BudgetDao.findOverlapping(x.term_beginning, x.term_end).map {
          case Some(_) => "BUDGET_OVERLAPPING".left
          case None => x.right
      })
      .transform

    v.map(BudgetDao.insert(_).flatMap(budgetToDTO)).run.transform
  }

  def list(): DBIO[Seq[BudgetDTO]] =
    BudgetDao.list().flatMap(x => DBIO.sequence(x.map(budgetToDTO)))

  /**
    * Retrieves specific Budget.
    * @param id transaction unique id.
    * @return DTO object.
    */
  def get(id: Long): DBIO[Option[BudgetDTO]] = {
    BudgetDao.find(id).flatMap { x =>
      x.map(budgetToDTO) match {
        case Some(f) => f.map(Some(_))
        case None => DBIO.successful(None)
      }
    }
  }

  /**
    * Removes budget and all dependent objects.
    *
    * @param id identification of budget to remove.
    * @return either error result, or resultHandler processing result.
    */
  def delete(id: Long): DBIO[\/[String, Int]] = {
    BudgetDao.delete(id).map {
      case 1 => 1.right
      case _ => "BUDGET_NOT_FOUND".left
    }
  }
}
