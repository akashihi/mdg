package controllers.dto.reporting
import java.time.LocalDate

import play.api.libs.json.Json

case class SimpleAssetReportEntry(date: LocalDate, value: BigDecimal) extends GenericReportEntry

object SimpleAssetReportEntry {
  implicit val simpleAssetReportEntryWrite = Json.writes[SimpleAssetReportEntry]
}
