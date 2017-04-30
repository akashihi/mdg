package dao

import javax.inject._

import dao.filters.AccountFilter
import dao.tables.Accounts
import models.Account
import play.api.db.slick._
import slick.dbio.Effect.Read
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._
import slick.profile.SqlAction

import scala.concurrent._

class AccountDao @Inject()(
    protected val dbConfigProvider: DatabaseConfigProvider)(
    implicit ec: ExecutionContext) {
  val db = dbConfigProvider.get[JdbcProfile].db
  val accounts = AccountDao.accounts

  def list(filter: AccountFilter): Future[Seq[Account]] = {
    db.run(
      accounts
        .filter { a =>
          List(
            filter.currency_id.map(a.currency_id === _),
            filter.name.map(a.name === _),
            filter.hidden.map(a.hidden === _)
          ).collect({ case Some(x) => x })
            .reduceLeftOption(_ || _)
            .getOrElse(true: Rep[Boolean])
        }
        .sortBy(_.name.asc)
        .result)
  }

  def findById(id: Long): Future[Option[Account]] = {
    db.run(AccountDao.accountByIdAction(id))
  }

  def insert(a: Account): Future[Account] = {
    db.run(
      accounts returning accounts
        .map(_.id) into ((item, id) => item.copy(id = id)) += a)
  }

  def update(a: Account): Future[Option[Account]] = {
    db.run(accounts.filter(_.id === a.id).update(a)).map {
      case 1 => Some(a)
      case _ => None
    }
  }

  def delete(id: Long): Future[Option[Int]] = {
    db.run((for { a <- accounts if a.id === id } yield a.hidden).update(true))
      .map {
        case 1 => Some(1)
        case _ => None
      }
  }
}

object AccountDao {
  val accounts = TableQuery[Accounts]

  def accountByIdAction(id: Long): SqlAction[Option[Account], NoStream, Read] = {
    accounts.filter(_.id === id).result.headOption
  }
}
