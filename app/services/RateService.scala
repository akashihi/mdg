package services

import java.time.LocalDateTime

import dao.{SqlDatabase, SqlExecutionContext}
import dao.queries.RateQuery
import javax.inject.Inject
import models.Rate
import util.EitherOps._
import scalaz._
import Scalaz._

import scala.concurrent._

/**
  * Rate operations service.
  */
class RateService @Inject()(protected val sql: SqlDatabase, protected val ss: SettingService)(implicit ec: SqlExecutionContext) {

  /**
    * Lists rates for specified point in time.
    * * @param ts Rate validity timestamp.
    * @return Sequence of rates for specified ts.
    */
  def list(ts: LocalDateTime): Future[Seq[Rate]] = sql.query(RateQuery.list(ts))

  /**
    * Retrieves rate for currencies pair at specified point in time.
    * @param ts Rate validity timestamp.
    * @param from Id of a currency you would like to sell.
    * @param to Id of a currency you would like to buy.
    * @return Rate. If rate value is missing, it will return default rate of '1'.
    */
  def get(ts: LocalDateTime, from: Long, to: Long): Future[Rate] =
    sql.query(RateQuery
      .findByPair(ts, from, to)
      .map(_.getOrElse(Rate(Some(-1), ts, ts, from, to, 1))))

  def getCurrentRateToPrimary(from: Long): ErrorF[Rate] = {
    val currency = ss.get(PrimaryCurrency)

    currency.map( c => this.get(LocalDateTime.now(), from, c.value.toLong))
      .map(_.right)
      .flatMap(_.transform)
  }
}
