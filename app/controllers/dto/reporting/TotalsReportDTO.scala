package controllers.dto.reporting

import controllers.api.IdentifiableObject.LongIdentifiable
import play.api.libs.json._
import controllers.api.OWritesOps._

case class TotalsDetailEntry(balance: BigDecimal, currency_id: Long)
case class TotalsReportEntry(assetType: String, primary_balance: BigDecimal, totals: Seq[TotalsDetailEntry])
case class TotalsReportDTO(id: Option[Long], value: Seq[TotalsReportEntry]) extends LongIdentifiable

object TotalsDetailEntry {
  implicit val totalsDetailEntryWrite = Json.writes[TotalsDetailEntry]
}

object TotalsReportEntry {
  implicit val totalsReportEntryWrite = Json.writes[TotalsReportEntry]
}

object TotalsReportDTO {
  implicit val totalsReportDTOWrite = Json
    .writes[TotalsReportDTO]
    .removeField("id")
}
