package controllers.dto.reporting

import play.api.libs.json._

case class TotalsReportValue(category_id: Long, primary_balance: BigDecimal, totals: Seq[ReportIdentifiedValue[Long]]) extends ReportValue

object TotalsReportValue {
  implicit val totalsReportEntryWrite = Json.writes[TotalsReportValue]
}

