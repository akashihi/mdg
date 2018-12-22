package controllers.dto.reporting

import play.api.libs.json._

case class TotalsDetailEntry(balance: BigDecimal, currency_id: Long)
case class TotalsReportEntry(asset_type: String, primary_balance: BigDecimal, totals: Seq[TotalsDetailEntry]) extends GenericReportEntry

object TotalsDetailEntry {
  implicit val totalsDetailEntryWrite = Json.writes[TotalsDetailEntry]
}

object TotalsReportEntry {
  implicit val totalsReportEntryWrite = Json.writes[TotalsReportEntry]
}

