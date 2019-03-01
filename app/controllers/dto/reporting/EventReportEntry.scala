package controllers.dto.reporting
import java.time.LocalDate

import play.api.libs.json.Json

case class EventReportDetail(account_id: Long, value: BigDecimal)

case class EventReportEntry(date: LocalDate, entries: Seq[EventReportDetail]) extends GenericReportEntry

object EventReportDetail {
  implicit val eventReportDetailWrites = Json.writes[EventReportDetail]
}

object EventReportEntry {
  implicit val eventReportEntryWrites = Json.writes[EventReportEntry]
}