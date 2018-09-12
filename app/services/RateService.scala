package services

import java.time.LocalDateTime

import dao.queries.RateQuery
import models.Rate
import play.api.libs.concurrent.Execution.Implicits._
import slick.jdbc.PostgresProfile.api._
import util.EitherD

/**
  * Rate operations service.
  */
object RateService {

  /**
    * Lists rates for specified point in time.
    * * @param ts Rate validity timestamp.
    * @return Sequence of rates for specified ts.
    */
  def list(ts: LocalDateTime): DBIO[Seq[Rate]] = RateQuery.list(ts)

  /**
    * Retrieves rate for currencies pair at specified point in time.
    * @param ts Rate validity timestamp.
    * @param from Id of a currency you would like to sell.
    * @param to Id of a currency you would like to buy.
    * @return Rate. If rate value is missing, it will return default rate of '1'.
    */
  def get(ts: LocalDateTime, from: Long, to: Long): DBIO[Rate] =
    RateQuery
      .findByPair(ts, from, to)
      .map(_.getOrElse(Rate(Some(-1), ts, ts, from, to, 1)))

  def getCurrentRateToPrimary(from: Long): EitherD[String, Rate] = {
    SettingService.get(SettingService.PrimaryCurrency)
    .map { pc =>
      RateService.get(LocalDateTime.now(),
        from,
        pc.value.toLong)
    } flatten
  }
}
