package dao

import java.time.LocalDate
import javax.inject.Inject

import dao.tables.Budgets
import dao.tables.Budgets.localDtoDate
import models.Budget
import play.api.db.slick._
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent._

/**
  * Created by dchaplyg on 3/17/17.
  */
class BudgetDao @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  val db = dbConfigProvider.get[JdbcProfile].db
  val budgets = TableQuery[Budgets]

  def insert(a: Budget): Future[Budget] = db.run(budgets returning budgets += a)

  def list(): Future[Seq[Budget]] = db.run(budgets.result)

  def find(id: Long): Future[Option[Budget]] = {
    db.run(budgets.filter(_.id <= id).sortBy(_.id.desc).take(1).result.headOption)
  }

  def findOverlapping(term_beginning: LocalDate, term_end: LocalDate): Future[Option[Budget]] = {
    db.run(budgets.filter(b => b.term_beginning <= term_end && b.term_end >= term_beginning).take(1).result.headOption)
  }

  def delete(id: Long): Future[Option[Int]] = {
    db.run(budgets.filter(_.id === id).delete).map {
      case 1 => Some(1)
      case _ => None
    }
  }
}
