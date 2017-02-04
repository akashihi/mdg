package dao

import javax.inject._

import dao.filters.AccountFilter
import dao.tables.Accounts
import models.{Account, AccountType}
import play.api.db.slick._
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent._

class AccountDao @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  val db = dbConfigProvider.get[JdbcProfile].db
  val accounts = TableQuery[Accounts]

  val insertQuery = accounts returning accounts.map(_.id) into ((item, id) => item.copy(id = id))

  def list(filter: AccountFilter): Future[Seq[Account]] = {
    db.run(accounts.filter { a =>
      List(
        filter.currency_id.map(a.currency_id === _),
        filter.name.map(a.name === _),
        filter.hidden.map(a.hidden === _)
      ).collect({ case Some(a) => a }).reduceLeftOption(_ || _).getOrElse(true: Rep[Boolean])
    }.sortBy(_.name.asc).result)
  }

  def findById(id: Long): Future[Option[Account]] = {
    db.run(accounts.filter(_.id === id).result.headOption)
  }

  def insert(a: Account): Future[Account] = {
    db.run(insertQuery += a)
  }

  def update(a: Account): Future[Option[Account]] = {
    db.run(accounts.filter(_.id === a.id).update(a)).map {
      case 1 => Some(a)
      case _ => None
    }
  }

  def delete(id: Long): Future[Option[Int]] = {
    db.run((for {a <- accounts if a.id === id} yield a.hidden).update(true)).map {
      case 1 => Some(1)
      case _ => None
    }
  }
}
