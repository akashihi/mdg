package dao

import dao.filters.AccountFilter
import dao.tables.Accounts
import models.Account
import play.api.libs.concurrent.Execution.Implicits._
import slick.driver.PostgresDriver.api._

object AccountDao {
  val accounts = TableQuery[Accounts]

  def insert(a: Account): DBIO[Account] = {
      accounts returning accounts
        .map(_.id) into ((item, id) => item.copy(id = id)) += a
  }

  def list(filter: AccountFilter): DBIO[Seq[Account]] = {
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
      .result
  }

  def findById(id: Long): DBIO[Option[Account]] = {
    accounts.filter(_.id === id).result.headOption
  }

  def update(a: Account): DBIO[Option[Account]] = {
    accounts.filter(_.id === a.id).update(a).map {
      case 1 => Some(a)
      case _ => None
    }
  }

  def delete(id: Long): DBIO[Option[Int]] = {
    (for { a <- accounts if a.id === id } yield a.hidden)
      .update(true)
      .map {
        case 1 => Some(1)
        case _ => None
      }
  }
}
