package controllers.reporting
import java.time.LocalDate
import java.time.format.DateTimeFormatter

import controllers.api.ResultMaker.makeResult
import controllers.dto.reporting.GenericReportDTO
import dao.SqlExecutionContext
import javax.inject.Inject
import play.api.mvc.InjectedController
import reports.ExpenseReport

import scala.concurrent.Future

class ExpenseReportController  @Inject() (protected val sar: ExpenseReport)(implicit ec: SqlExecutionContext)
  extends InjectedController {
  type ReportFunction = (LocalDate, LocalDate, Int) => Future[GenericReportDTO[_]]

  private def callReport(f: ReportFunction, start: String, end: String, granularity: Int) = {
    val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
    val startDate = LocalDate.parse(start, formatter)
    val endDate = LocalDate.parse(end, formatter)
    f(startDate, endDate, granularity).map(x => makeResult(x)(OK))
  }

  def expenseEventByCurrencyReport(start: String, end: String, granularity: Int) = Action.async {
    callReport(sar.expensEventsByAccountReport, start, end, granularity)
  }

}
