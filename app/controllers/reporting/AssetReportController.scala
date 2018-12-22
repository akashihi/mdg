package controllers.reporting
import java.time.LocalDate
import java.time.format.DateTimeFormatter

import controllers.api.ResultMaker.makeResult
import dao.SqlExecutionContext
import javax.inject.{Inject, Singleton}
import play.api.mvc.InjectedController
import reports.AssetReport

/**
  * TotalsReport resource REST controller
  */
@Singleton
class AssetReportController @Inject() (protected val sar: AssetReport)(implicit ec: SqlExecutionContext)
  extends InjectedController {

  def simpleAssetReport(start: String, end: String, granularity: Int) = Action.async {
    val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
    val startDate = LocalDate.parse(start, formatter)
    val endDate = LocalDate.parse(end, formatter)
    sar.simpleAssetReport(startDate, endDate, granularity).map(x => makeResult(x)(OK))
  }

  def assetByCurrencyReport(start: String, end: String, granularity: Int) = Action.async {
    val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
    val startDate = LocalDate.parse(start, formatter)
    val endDate = LocalDate.parse(end, formatter)
    sar.assetByCurrencyReport(startDate, endDate, granularity).map(x => makeResult(x)(OK))
  }
}
