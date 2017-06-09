package dao

import javax.inject.Inject

import dao.AccountDao._
import dao.TransactionDao._
import dao.BudgetDao._
import dao.tables.BudgetEntries
import models.{Budget, BudgetEntry, IncomeAccount}
import play.api.db.slick._
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent._

class BudgetEntryDao @Inject()(
    protected val dbConfigProvider: DatabaseConfigProvider)(
    implicit ec: ExecutionContext) {
  val db = dbConfigProvider.get[JdbcProfile].db
  val entries = BudgetEntryDao.entries

  def list(budget_id: Long): Future[Seq[BudgetEntry]] =
    db.run(entries.filter(_.budget_id === budget_id).result)

  def find(id: Long, budget_id: Long): Future[Option[BudgetEntry]] =
    db.run(entries.filter(_.id === id).result.headOption)

  def update(entry: BudgetEntry): Future[Option[BudgetEntry]] = {
    db.run(entries.filter(_.id === entry.id).update(entry)).map {
      case 1 => Some(entry)
      case _ => None
    }
  }

  def getActualSpendings(account_id: Long,
                         budget: Budget): Future[BigDecimal] = {
    val query =
      transactionsForPeriod(budget.term_beginning, budget.term_end).flatMap {
        txId =>
          val value = operations
            .filter(_.tx_id inSet txId)
            .filter(_.account_id === account_id)
            .map(_.amount)
            .sum
            .result

          AccountDao.findById(account_id).flatMap { acc =>
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
    db.run(query)
  }
}

object BudgetEntryDao {
  val entries = TableQuery[BudgetEntries]
}
