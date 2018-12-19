package reports
import java.time.LocalDate
import java.time.temporal.ChronoUnit

import controllers.dto.reporting.{SimpleAssetReportDTO, SimpleAssetReportEntry}
import dao.{SqlDatabase, SqlExecutionContext}
import javax.inject.Inject
import services.RateService

import scala.concurrent.Future

class SimpleAssetReport @Inject() (protected val rs: RateService, protected val sql: SqlDatabase)
                                  (implicit ec: SqlExecutionContext){
  def calculate(start: LocalDate, end: LocalDate, granularity: Int): Future[Seq[(LocalDate, BigDecimal)]] = {
    val numberOfDays = ChronoUnit.DAYS.between(start, end)/granularity
    val daysGenerated = for (f <- 0 to numberOfDays.intValue()) yield start.plusDays(f)
    val days = daysGenerated.+:(end)

    val series = days.map(d => (d, BigDecimal(1)))

    Future.successful(series)
  }

  def get(start: LocalDate, end: LocalDate, granularity: Int): Future[SimpleAssetReportDTO] = {
    val report = this.calculate(start, end, granularity)
    val entries = report.map(s => s.map(e => SimpleAssetReportEntry(e._1, e._2)))
    entries.map(SimpleAssetReportDTO(Some(-1), _))
  }
}
