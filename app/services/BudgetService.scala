package services

import controllers.dto.{BudgetDTO, BudgetPairedAmount, BudgetState}
import dao.filters.EmptyAccountFilter
import dao.{AccountDao, BudgetDao, TransactionDao}
import models.{Account, Budget, ExpenseAccount, IncomeAccount}
import slick.driver.PostgresDriver.api._
import util.ErrXor._
import util.Validator._

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
  private def getActualSpendings(b: Budget, incomeAccounts: Seq[Account], expenseAccounts: Seq[Account]): DBIO[(BigDecimal, BigDecimal)] = {
      TransactionDao.transactionsForPeriod(b.term_beginning, b.term_end).flatMap { txId =>
        val ops = TransactionDao.listOperations(txId)

        ops.flatMap { o =>
          val income = o
            .filter(x => incomeAccounts.flatMap(_.id).contains(x.account_id))
            .foldLeft(BigDecimal(0))(_ + _.amount)
          val expense = o
            .filter(x => expenseAccounts.flatMap(_.id).contains(x.account_id))
            .foldLeft(BigDecimal(0))(_ + _.amount)

          //We have to negate values, as income
          //ops are substracted from their accounts,
          //while expense ops are added. But for spending
          //calculation we need opposite direction.
          DBIO.successful((-income, expense))
        }
      }
  }

  /**
    * Calculates budget estimated remains change.
    * @param b budget to estimate.
    * @return expected change, actual change.
    */
  def getExpectedChange(b: Budget, incomeAccounts: Seq[Long], expenseAccounts: Seq[Long]): DBIO[(BigDecimal, BigDecimal)] = {
    b.id
      .map(x => BudgetDao.getExpectedChange(x, incomeAccounts) zip BudgetDao.getExpectedChange(x, expenseAccounts))
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
        getExpectedChange(b, incomeAccounts.flatMap(_.id), expenseAccounts.flatMap(_.id)).flatMap { expectedChange =>
          val (expectedIncome, expectedExpense) = expectedChange
          getActualSpendings(b, incomeAccounts, expenseAccounts).map { spendings =>
            val (income, expense) = spendings
            BudgetDTO(b.id,
              b.term_beginning,
              b.term_end,
              incoming,
              BudgetPairedAmount(incoming + expectedIncome - expectedExpense,
                incoming + income - expense),
              BudgetState(BudgetPairedAmount(expectedIncome,income), BudgetPairedAmount(expectedExpense,expense)))
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
  def add(budget: Option[Budget]): DBIO[\/[String, BudgetDTO]] = {
    val b = budget match {
      case Some(x) => x.right
      case None => "BUDGET_DATA_INVALID".left
    }
    val v = b
      .map { validate }
      .flatMap { validationToXor }
      .map(x =>
        BudgetDao.findOverlapping(x.term_beginning, x.term_end).map {
          case Some(_) => "BUDGET_OVERLAPPING".left
          case None => x.right
      })

    val s = invert(v).map(_.map(BudgetDao.insert(_).flatMap(budgetToDTO)))
    invert(s)
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
