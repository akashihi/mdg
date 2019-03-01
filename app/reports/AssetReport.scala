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
  def simpleAssetReport(start: LocalDate, end: LocalDate, granularity: Int): Future[GenericReportDTO[SimpleAssetReportEntry]] = {
    val series = expandPeriod(start, end,granularity).map(d => sql.query(AssetQuery.getTotalAssetsForDate(d)).map((d,_)))
    val report = Future.sequence(series)
    val entries = report.map(s => s.map(e => SimpleAssetReportEntry(e._1, e._2)))
    entries.map(GenericReportDTO(Some("simple_asset"), _))
  }

  def assetByCurrencyReport(start: LocalDate, end: LocalDate, granularity: Int): Future[GenericReportDTO[AssetByCurrencyReportEntry]] = {
    val series = expandPeriod(start, end, granularity)
      .map(d => sql.query(AssetQuery.getTotalAssetsByCurrencyForDate(d)).map((d,_)))
    val report = Future.sequence(series)
    val detailed = report.map(_.map(e => (e._1, e._2.map(d => AssetByCurrencyReportDetail(d._1, d._2)))))
    val entries = detailed.map(s => s.map(e => AssetByCurrencyReportEntry(e._1, e._2)))
    entries.map(GenericReportDTO(Some("asset_by_currency"), _))
  }

  def assetByTypeReport(start: LocalDate, end: LocalDate, granularity: Int): Future[GenericReportDTO[AssetByTypeReportEntry]] = {
    val series = expandPeriod(start, end, granularity)
      .map(d => sql.query(AssetQuery.getTotalAssetsByTypeForDate(d)).map((d,_)))
    val report = Future.sequence(series)
    val detailed = report.map(_.map(e => (e._1, e._2.map(d => AssetByTypeReportDetail(d._1, d._2)))))
    val entries = detailed.map(s => s.map(e => AssetByTypeReportEntry(e._1, e._2)))
    entries.map(GenericReportDTO(Some("asset_by_type"), _))
  }
}
