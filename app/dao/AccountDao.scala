package dao

import javax.inject._

import dao.tables.Accounts
import models.Account
import play.api.db.slick._
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent._

class AccountDao @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  val db = dbConfigProvider.get[JdbcProfile].db
  val accounts = TableQuery[Accounts]

  val insertQuery = accounts returning accounts.map(_.id) into ((item, id) => item.copy(id = id))

  def list(): Future[Seq[Account]] = {
    db.run(accounts.result)
  }

  def findById(id: Long): Future[Option[Account]] = {
    db.run(accounts.filter(_.id === id).result.headOption)
  }

  def insert(a: Account): Future[Account] = {
    db.run(insertQuery += a)
  }
}
