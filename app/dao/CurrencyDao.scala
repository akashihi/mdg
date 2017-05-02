package dao

import dao.tables.Currencies
import models.Currency
import slick.driver.PostgresDriver.api._

object CurrencyDao {
  val currencies = TableQuery[Currencies]

  def list(): DBIO[Seq[Currency]] =
    currencies.result

  def findById(id: Long): DBIO[Option[Currency]] =
    currencies.filter(_.id === id).result.headOption
}
