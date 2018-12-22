package reports
import java.time.LocalDate
import java.time.temporal.ChronoUnit

import controllers.dto.reporting.{AssetByCurrencyReportDetail, AssetByCurrencyReportEntry, GenericReportDTO}
import dao.{SqlDatabase, SqlExecutionContext}
import dao.queries.AssetQuery
import javax.inject.Inject

import scala.concurrent.Future

class AssetByCurrencyReport @Inject() (protected val sql: SqlDatabase)
                                      (implicit ec: SqlExecutionContext){
  def calculate(start: LocalDate, end: LocalDate, granularity: Int): Future[Seq[(LocalDate, Seq[(Long,BigDecimal)])] = {
    val numberOfDays = ChronoUnit.DAYS.between(start, end)/granularity
    val daysGenerated = for (f <- 0L to numberOfDays) yield start.plusDays(f*granularity)
    val days = daysGenerated.:+(end)

    val series = days.map(d => sql.query(AssetQuery.getTotalAssetsByCurrencyForDate(d)).map((d,_)))

    Future.sequence(series)
  }

  def get(start: LocalDate, end: LocalDate, granularity: Int): Future[GenericReportDTO[AssetByCurrencyReportEntry]] = {
    val report = this.calculate(start, end, granularity)
    val detailed = report.map(_.map(e => (e._1, e._2.map(d => AssetByCurrencyReportDetail(d._1, d._2)))))
    val entries = detailed.map(s => s.map(e => AssetByCurrencyReportEntry(e._1, e._2)))
    entries.map(GenericReportDTO(Some("asset_by_currency"), _))
  }
}
