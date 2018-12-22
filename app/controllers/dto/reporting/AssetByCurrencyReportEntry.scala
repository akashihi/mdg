package controllers.dto.reporting
import java.time.LocalDate

import play.api.libs.json.Json

case class AssetByCurrencyReportDetail(currency: Long, value: BigDecimal)

case class AssetByCurrencyReportEntry(date: LocalDate, entries: Seq[AssetByCurrencyReportDetail]) extends GenericReportEntry

object AssetByCurrencyReportDetail {
  implicit val assetByCurrencyReportDetailWrite = Json.writes[AssetByCurrencyReportDetail]
}

object AssetByCurrencyReportEntry {
  implicit val assetByCurrencyReportEntryWrites = Json.writes[AssetByCurrencyReportEntry]
}