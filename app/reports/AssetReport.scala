package reports
import java.time.LocalDate
import java.time.temporal.ChronoUnit

import controllers.dto.reporting.{AssetByCurrencyReportDetail, AssetByCurrencyReportEntry, GenericReportDTO, SimpleAssetReportEntry}
import dao.queries.AssetQuery
import dao.{SqlDatabase, SqlExecutionContext}
import javax.inject.Inject

import scala.concurrent.Future

class AssetReport @Inject() (protected val sql: SqlDatabase)
                                  (implicit ec: SqlExecutionContext){
  /**
    * Takes period of two dates and granularity
    * and generated list of days between those two days
    * with specified granularity.
    * @param start First date of the period (inclusive)
    * @param end Last date of the period (inclusive)
    * @param granularity quantity of days between two dates
    * @return A sorted array of dates between start and end, filled
    *         with days, that have granularity days between them.
    */
  private def expandPeriod(start: LocalDate,
                           end: LocalDate,
                           granularity: Int) = {
    val numberOfDays = ChronoUnit.DAYS.between(start, end) / granularity
    val daysGenerated = for (f <- 0L to numberOfDays)
      yield start.plusDays(f * granularity)
    val days = daysGenerated.:+(end)
    days
  }

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
}
