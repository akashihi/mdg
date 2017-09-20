package services

import java.time.LocalDateTime

import dao.RateDao
import models.Rate
import play.api.libs.concurrent.Execution.Implicits._
import slick.driver.PostgresDriver.api._

/**
  * Rate operations service.
  */
object RateService {

  /**
    * Lists rates for specified point in time.
    * * @param ts Rate validity timestamp.
    * @return Sequence of rates for specified ts.
    */
  def list(ts: LocalDateTime): DBIO[Seq[Rate]] = RateDao.list(ts)

  /**
    * Retrieves rate for currencies pair at specified point in time.
    * @param ts Rate validity timestamp.
    * @param from Id of a currency you would like to sell.
    * @param to Id of a currency you would like to buy.
    * @return Rate. If rate value is missing, it will return default rate of '1'.
    */
  def get(ts: LocalDateTime, from: Long, to: Long): DBIO[Rate] =
    RateDao
      .findByPair(ts, from, to)
      .map(_.getOrElse(Rate(Some(-1), ts, ts, from, to, 1)))
}
