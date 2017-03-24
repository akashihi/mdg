package dao

import javax.inject.Inject

import dao.tables.BudgetEntries
import models.BudgetEntry
import play.api.db.slick._
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent._

class BudgetEntryDao @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  val db = dbConfigProvider.get[JdbcProfile].db
  val budgets = TableQuery[BudgetEntries]

  def list(budget_id: Long): Future[Seq[BudgetEntry]] = db.run(budgets.filter(_.budget_id === budget_id).result)

  def find(id: Long, budget_id: Long): Future[Option[BudgetEntry]] = db.run(budgets.filter(_.id === id).result.headOption)

  def update(entry: BudgetEntry): Future[Option[BudgetEntry]] = {
    db.run(budgets.filter(_.id === entry.id).update(entry)).map {
      case 1 => Some(entry)
      case _ => None
    }
  }
}
