package controllers.reporting

import java.time.LocalDate
import java.time.format.DateTimeFormatter

import javax.inject._
import controllers.api.ResultMaker._
import controllers.dto.reporting.GenericReportDTO
import dao._
import play.api.mvc._
import reports.BudgetReport

import scala.concurrent.Future

/**
  * BudgetReport resource REST controller
  */
@Singleton
class BudgetReportController @Inject() (protected val brs: BudgetReport)(implicit ec: SqlExecutionContext)
  extends InjectedController {
  type ReportFunction = (LocalDate, LocalDate) => Future[GenericReportDTO[_]]

  private def callReport(f: ReportFunction, start: String, end: String) = {
    val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
    val startDate = LocalDate.parse(start, formatter)
    val endDate = LocalDate.parse(end, formatter)
    f(startDate, endDate).map(x => makeResult(x)(OK))
  }
  /**
    * Budget Execution Report access method
    *
    * @return BudgetExecutionReport wrapped to Json
    */
  def execution(start: String, end: String) = Action.async {
    callReport(brs.getExecution, start, end)
  }
}
