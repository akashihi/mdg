package controllers.dto.reporting
import java.time.LocalDate

import play.api.libs.json.Json

case class AssetByTypeReportDetail(`type`: String, value: BigDecimal)
case class AssetByTypeReportEntry(date: LocalDate, entries: Seq[AssetByTypeReportDetail]) extends GenericReportEntry

object AssetByTypeReportDetail {
  implicit val assetByTypeReportDetailWrites = Json.writes[AssetByTypeReportDetail]
}

object AssetByTypeReportEntry {
  implicit val assetByTypeReportEntryWrites = Json.writes[AssetByTypeReportEntry]
}