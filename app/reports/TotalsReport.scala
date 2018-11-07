package reports

import dao.reporting.AccountReportQuery
import dao.{SqlDatabase, SqlExecutionContext}
import javax.inject.Inject
import services.RateService

import scala.concurrent.Future

import scalaz._
import Scalaz._

class TotalsReport @Inject() (protected val rs: RateService, protected val sql: SqlDatabase)
                             (implicit ec: SqlExecutionContext) {
  def get(): Future[Map[String,(BigDecimal,Seq[(Long,BigDecimal)])]] = {
    var values = sql.query(AccountReportQuery.getTotalsByTypeAndCurrency)
    var withRate = values.map(
      _.map(
        v => (rs.getCurrentRateToPrimary(v._1).map(_.rate).getOrElse(0), v._1, v._2, v._3)
      ).map(v => Applicative[Future].tuple4(v._1,Future.successful(v._2), Future.successful(v._3), Future.successful(v._4)))
    ).flatMap(Future.sequence(_))
    var withPrimary = withRate.map(_.map(v => (v._1 * v._4, v._2, v._3, v._4)))
    var byType = withPrimary.map(_.groupBy(_._3).mapValues(_.map(a => (a._1, a._2, a._4))))
    var withTotals = byType.map(_.mapValues(v => (v.map(_._1).sum, v)))
    withTotals.map(_.mapValues(v => (v._1, v._2.map(e => (e._2, e._3)))))
  }
}
