package reports
import java.time.LocalDate
import PeriodUtils._

import controllers.dto.reporting._
import dao.queries.AssetQuery
import dao.{SqlDatabase, SqlExecutionContext}
import javax.inject.Inject

import scala.concurrent.Future

class AssetReport @Inject() (protected val sql: SqlDatabase)
                                  (implicit ec: SqlExecutionContext){
  def simpleAssetReport(start: LocalDate, end: LocalDate, granularity: Int): Future[GenericReportDTO[ReportValueInTime]] = {
    val series = expandPeriod(start, end,granularity).map(d => sql.query(AssetQuery.getTotalAssetsForDate(d)).map((d,_)))
    val report = Future.sequence(series)
    val entries = report.map(s => s.map(e => ReportValueInTime(e._1, e._2)))
    entries.map(GenericReportDTO(Some("simple_asset"), _))
  }

  def assetByCurrencyReport(start: LocalDate, end: LocalDate, granularity: Int): Future[GenericReportDTO[ReportIdentifiedValueInTime[Long]]] = {
    val series = expandPeriod(start, end, granularity)
      .map(d => sql.query(AssetQuery.getTotalAssetsByCurrencyForDate(d)).map((d,_)))
    val report = Future.sequence(series)
    val detailed = report.map(_.flatMap(e => e._2.map(d => (e._1, d._1, d._2))))
    val entries = detailed.map(_.map(e => ReportIdentifiedValueInTime(e._1, e._3, e._2)))
    entries.map(GenericReportDTO(Some("asset_by_currency"), _))
  }

  def assetByTypeReport(start: LocalDate, end: LocalDate, granularity: Int): Future[GenericReportDTO[ReportIdentifiedValueInTime[String]]] = {
    val series = expandPeriod(start, end, granularity)
      .map(d => sql.query(AssetQuery.getTotalAssetsByTypeForDate(d)).map((d,_)))
    val report = Future.sequence(series)
    val detailed = report.map(_.flatMap(e => e._2.map(d => (e._1, d._1, d._2))))
    val entries = detailed.map(_.map(e => ReportIdentifiedValueInTime(e._1, e._3, e._2)))
    entries.map(GenericReportDTO(Some("asset_by_type"), _))
  }
}
