package dao.queries

import dao.filters.AccountFilter
import dao.tables.{Accounts, AssetAccountProperties}
import models.{Account, AssetAccountProperty}
import slick.jdbc.PostgresProfile.api._

import scala.concurrent.ExecutionContext

object AccountQuery {
  val accounts = TableQuery[Accounts]
  val assetAccountProperties = TableQuery[AssetAccountProperties]

  def insert(a: Account): DBIO[Account] = accounts returning accounts
      .map(_.id) into ((item, id) => item.copy(id = id)) += a

  def insertWithProperties(p: AssetAccountProperty)(a: Account)(implicit ec: ExecutionContext): DBIO[Account] =
    insert(a)
      .flatMap(aId => (assetAccountProperties returning assetAccountProperties += p.copy(id = aId.id)).map(_ => aId))
      .transactionally


  def listAll: DBIO[Seq[Account]] = accounts.result

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

  def findPropertyById(id: Long): DBIO[Option[AssetAccountProperty]] = {
    assetAccountProperties.filter(_.id === id).result.headOption
  }

  def update(a: Account)(implicit ec: ExecutionContext): DBIO[Option[Account]] = {
    accounts.filter(_.id === a.id).update(a).map {
      case 1 => Some(a)
      case _ => None
    }
  }

  def updateWithProperties(p: AssetAccountProperty)(a: Account)(implicit ec: ExecutionContext): DBIO[Option[Account]] = {
    val propQuery = assetAccountProperties.filter(_.id === p.id).update(p).map {
      case 1 => Some(a)
      case _ => None
    }

    propQuery.map(_.map(update)).flatMap(_.getOrElse(DBIO.successful(None)))
  }

  def delete(id: Long)(implicit ec: ExecutionContext): DBIO[Option[Int]] = {
    (for { a <- accounts if a.id === id } yield a.hidden)
      .update(true)
      .map {
        case 1 => Some(1)
        case _ => None
      }
  }
}
