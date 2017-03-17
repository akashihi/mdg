package dao

import javax.inject.Inject

import dao.tables.Budgets
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

  def insert(a: Budget): Future[Budget] = {
    db.run(budgets returning budgets.map(_.id) into ((item, id) => item.copy(id = Some(id))) += a)
  }
}
