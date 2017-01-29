package dao

import javax.inject._

import dao.tables.Currencies
import models.Currency
import play.api.db.slick._
import slick.driver.JdbcProfile
import slick.driver.PostgresDriver.api._

import scala.concurrent._

class CurrencyDao @Inject() (protected val dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {
  val db = dbConfigProvider.get[JdbcProfile].db
  val currencies = TableQuery[Currencies]

  def list(): Future[Seq[Currency]] = {
    db.run(currencies.result)
  }
}
