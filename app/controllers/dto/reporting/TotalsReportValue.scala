package controllers.dto.reporting

import play.api.libs.json._

case class TotalsReportValue(asset_type: String, primary_balance: BigDecimal, totals: Seq[ReportIdentifiedValue[Long]]) extends ReportValue

object TotalsReportValue {
  implicit val totalsReportEntryWrite = Json.writes[TotalsReportValue]
}

