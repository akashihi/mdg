package controllers.reporting
import java.time.LocalDate
import java.time.format.DateTimeFormatter

import controllers.api.ResultMaker.makeResult
import dao.SqlExecutionContext
import javax.inject.{Inject, Singleton}
import play.api.mvc.InjectedController
import reports.SimpleAssetReport

/**
  * TotalsReport resource REST controller
  */
@Singleton
class SimpleAssetReportController @Inject() (protected val sar: SimpleAssetReport)(implicit ec: SqlExecutionContext)
  extends InjectedController {

  /**
    * TotalsReport access method
    *
    * @return TotalsReport wrapped to Json
    */
  def index(start: String, end: String, granularity: Int) = Action.async {
    val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
    val startDate = LocalDate.parse(start, formatter)
    val endDate = LocalDate.parse(end, formatter)
    sar.get(startDate, endDate, granularity).map(x => makeResult(x)(OK))
  }
}
