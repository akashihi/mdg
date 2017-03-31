package dao

import java.sql.Date
import java.time.LocalDate
import javax.inject.Inject

import dao.tables.Budgets.localDtoDate
import dao.tables.{BudgetEntries, Budgets}
import models.Budget
import play.api.db.slick._
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent._

class BudgetDao @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  val db = dbConfigProvider.get[JdbcProfile].db
  val budgets = TableQuery[Budgets]
  val entries = TableQuery[BudgetEntries]

  def insert(a: Budget): Future[Budget] = db.run(budgets returning budgets += a)

  def list(): Future[Seq[Budget]] = db.run(budgets.result)

  def find(id: Long): Future[Option[Budget]] = {
    db.run(budgets.filter(_.id <= id).sortBy(_.id.desc).take(1).result.headOption)
  }

  def findOverlapping(term_beginning: LocalDate, term_end: LocalDate): Future[Option[Budget]] = {
    db.run(budgets.filter(b => b.term_beginning <= term_end && b.term_end >= term_beginning).take(1).result.headOption)
  }

  def getIncomingAmount(term_beginning: LocalDate): Future[Option[BigDecimal]] = {
    val dt = Date.valueOf(term_beginning)
    val query = sql"select sum(o.amount) from operation as o, account as a, tx where o.account_id=a.id and o.tx_id=tx.id and a.account_type='asset' and a.hidden='f' and tx.ts < ${dt}".as[Option[BigDecimal]]
    db.run(query.head)
  }

  def getExpectedChange(budget_id: Long): Future[Option[BigDecimal]] = {
    db.run(entries.filter(_.budget_id === budget_id).map(_.expected_amount).sum.result)
  }

  def delete(id: Long): Future[Option[Int]] = {
    db.run(budgets.filter(_.id === id).delete).map {
      case 1 => Some(1)
      case _ => None
    }
  }
}
