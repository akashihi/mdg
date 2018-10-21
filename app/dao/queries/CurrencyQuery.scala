package dao.queries

import dao.tables.Currencies
import models.Currency
import slick.jdbc.PostgresProfile.api._

import scala.concurrent.ExecutionContext

object CurrencyQuery {
  val currencies = TableQuery[Currencies]

  def list(): DBIO[Seq[Currency]] =
    currencies.result

  def findById(id: Long): DBIO[Option[Currency]] =
    currencies.filter(_.id === id).result.headOption

  def update(a: Currency)(implicit ec: ExecutionContext): DBIO[Option[Currency]] = {
    currencies.filter(_.id === a.id).update(a).map {
      case 1 => Some(a)
      case _ => None
    }
  }
}
