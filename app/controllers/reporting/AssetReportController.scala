package controllers.reporting
import java.time.LocalDate
import java.time.format.DateTimeFormatter

import controllers.api.ResultMaker.makeResult
import controllers.dto.reporting.GenericReportDTO
import dao.SqlExecutionContext
import javax.inject.{Inject, Singleton}
import play.api.mvc.InjectedController
import reports.AssetReport

import scala.concurrent.Future

/**
  * TotalsReport resource REST controller
  */
@Singleton
class AssetReportController @Inject() (protected val sar: AssetReport)(implicit ec: SqlExecutionContext)
  extends InjectedController {

  type ReportFunction = (LocalDate, LocalDate, Int) => Future[GenericReportDTO[_]]

  private def callReport(f: ReportFunction, start: String, end: String, granularity: Int) = {
    val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
    val startDate = LocalDate.parse(start, formatter)
    val endDate = LocalDate.parse(end, formatter)
    f(startDate, endDate, granularity).map(x => makeResult(x)(OK))
  }

  def simpleAssetReport(start: String, end: String, granularity: Int) = Action.async {
    callReport(sar.simpleAssetReport, start, end, granularity)
  }

  def assetByCurrencyReport(start: String, end: String, granularity: Int) = Action.async {
    callReport(sar.assetByCurrencyReport, start, end, granularity)
  }
}
