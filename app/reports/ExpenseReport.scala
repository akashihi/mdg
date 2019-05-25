package reports
import java.time.LocalDate

import dao.{SqlDatabase, SqlExecutionContext}
import javax.inject.Inject
import PeriodUtils._
import controllers.dto.reporting.{GenericReportDTO, ReportIdentifiedValueInTime}
import dao.reporting.EventsReportQuery
import models.ExpenseAccount

import scala.concurrent.Future

class ExpenseReport @Inject() (protected val sql: SqlDatabase)
                             (implicit ec: SqlExecutionContext){
  def expensEventsByAccountReport(start: LocalDate, end: LocalDate, granularity: Int): Future[GenericReportDTO[ReportIdentifiedValueInTime[Long]]] = {
    val series = expandPeriod(start, end, granularity)
      .sliding(2)
      .map(d =>
        sql.query(EventsReportQuery.getTotalByAccountForDate(ExpenseAccount, d.head, d.last)).map((d, _))).toList
    val report = Future.sequence(series)
    val detailed = report.map(_.flatMap(e => e._2.map(d => (e._1.head, d._1, d._2))))
    val entries = detailed.map(s => s.map(e => ReportIdentifiedValueInTime(e._1, e._3, e._2)))
    entries.map(GenericReportDTO(Some("expense_events_by_account"), _))
  }

  def expenseStructureByAccountReport(start: LocalDate, end: LocalDate, granularity: Int): Future[GenericReportDTO[ReportIdentifiedValueInTime[Long]]] = {
    val report = sql.query(EventsReportQuery.getTotalByAccountForDate(ExpenseAccount, start, end).map((start, _)))
    val detailed = report.map(e => e._2.map(d => (d._1, d._2)))
    val entries = detailed.map(_.map(e => ReportIdentifiedValueInTime(end, e._2, e._1)))
    entries.map(GenericReportDTO(Some("expense_strcture_by_account"), _))
  }
}
