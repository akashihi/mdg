package dao

import java.time.LocalDateTime

import dao.tables.Rates
import models.Rate
import dao.mappers.LocalDateMapper._
import slick.jdbc.PostgresProfile.api._

object RateDao {
  val rates = TableQuery[Rates]

  def list(ts: LocalDateTime): DBIO[Seq[Rate]] =
    rates.filter(_.beginning <= ts).filter(_.end > ts).result

  def findByPair(ts: LocalDateTime, from: Long, to: Long): DBIO[Option[Rate]] =
    rates
      .filter(_.beginning <= ts)
      .filter(_.end > ts)
      .filter(_.from_currency === from)
      .filter(_.to_currency === to)
      .result
      .headOption
}
