package dao

import dao.tables.Currencies
import models.Currency
import slick.dbio.Effect.Read
import slick.driver.PostgresDriver.api._
import slick.profile.{FixedSqlStreamingAction, SqlAction}

object CurrencyDao {
  val currencies = TableQuery[Currencies]

  def list(): FixedSqlStreamingAction[Seq[Currency], Currency, Read] = currencies.result

  def findById(id: Long): SqlAction[Option[Currency], NoStream, Read] = currencies.filter(_.id === id).result.headOption
}
