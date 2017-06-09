package dao

import java.sql.Date
import java.time.LocalDate
import javax.inject.Inject

import dao.tables.Budgets.localDtoDate
import dao.TransactionDao._
import dao.AccountDao._
import dao.BudgetEntryDao._
import dao.tables._
import models.{Budget, ExpenseAccount, IncomeAccount}
import play.api.db.slick._
import slick.dbio.Effect.Read
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._
import slick.profile.{FixedSqlAction, SqlAction, SqlStreamingAction}

import scala.concurrent._

class BudgetDao @Inject()(
    protected val dbConfigProvider: DatabaseConfigProvider)(
    implicit ec: ExecutionContext) {
  val db = dbConfigProvider.get[JdbcProfile].db
  val budgets = BudgetDao.budgets

  def insert(a: Budget): Future[Budget] =
    db.run(budgets returning budgets += a)

  def list(): Future[Seq[Budget]] = db.run(budgets.result)

  def find(id: Long): Future[Option[Budget]] = {
    db.run(BudgetDao.budgetFindByIdAction(id))
  }

  def findOverlapping(term_beginning: LocalDate,
                      term_end: LocalDate): Future[Option[Budget]] = {
    db.run(
      budgets
        .filter(b =>
          b.term_beginning <= term_end && b.term_end >= term_beginning)
        .take(1)
        .result
        .headOption)
  }

  private def getIncomingAmount(term_beginning: LocalDate)
    : SqlStreamingAction[Vector[Option[BigDecimal]],
                         Option[BigDecimal],
                         Effect] = {
    val dt = Date.valueOf(term_beginning)
    sql"select sum(o.amount) from operation as o, account as a, tx where o.account_id=a.id and o.tx_id=tx.id and a.account_type='asset' and a.hidden='f' and tx.ts < ${dt}"
      .as[Option[BigDecimal]]
  }

  private def getExpectedChange(budget_id: Long)
    : FixedSqlAction[Option[BigDecimal],
                     _root_.slick.driver.PostgresDriver.api.NoStream,
                     Read] = {
    entries.filter(_.budget_id === budget_id).map(_.expected_amount).sum.result
  }

  private def getActualSpendings(term_beginning: LocalDate,
                                 term_end: LocalDate): DBIO[BigDecimal] = {
    accounts.result.flatMap { a =>
      val incomeAccounts =
        a.filter(_.account_type == IncomeAccount).flatMap(_.id)
      val expenseAccounts =
        a.filter(_.account_type == ExpenseAccount).flatMap(_.id)

      transactionsForPeriod(term_beginning, term_end).flatMap { txId =>
        val ops = operations.filter(_.tx_id inSet txId).result

        ops.flatMap { o =>
          val income = o
            .filter(x => incomeAccounts.contains(x.account_id))
            .foldLeft(BigDecimal(0))(_ + _.amount)
          val expense = o
            .filter(x => expenseAccounts.contains(x.account_id))
            .foldLeft(BigDecimal(0))(_ + _.amount)

          //We have to negate values, as income
          //ops are substracted from their accounts,
          //while expense ops are added. But for spending
          //calculation we need opposite direction.
          DBIO.successful(-income - expense)
        }
      }
    }
  }

  def getBudgetTotals(
      b: Budget): Future[(BigDecimal, BigDecimal, BigDecimal)] = {
    val incomingAction =
      getIncomingAmount(b.term_beginning).head.map(_.getOrElse(BigDecimal(0)))
    val actualAction = getActualSpendings(b.term_beginning, b.term_end)
    val expectedAction = b.id match {
      case None => DBIO.successful(BigDecimal(0))
      case Some(x) => getExpectedChange(x).map(_.getOrElse(BigDecimal(0)))
    }

    val actions =
      DBIO.sequence(Seq(incomingAction, expectedAction, actualAction))

    val results = db.run(actions)
    results.map(seq => { (seq.head, seq(1), seq(2)) })
  }

  def delete(id: Long): Future[Option[Int]] = {
    db.run(budgets.filter(_.id === id).delete).map {
      case 1 => Some(1)
      case _ => None
    }
  }
}

object BudgetDao {
  val budgets = TableQuery[Budgets]

  def budgetFindByIdAction(
      id: Long): SqlAction[Option[Budget], NoStream, Read] = {
    budgets.filter(_.id <= id).sortBy(_.id.desc).take(1).result.headOption
  }
}
