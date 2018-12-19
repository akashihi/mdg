package controllers.dto.reporting
import java.time.LocalDate
import controllers.api.OWritesOps._

import controllers.api.IdentifiableObject.LongIdentifiable
import play.api.libs.json.Json

case class SimpleAssetReportEntry(date: LocalDate, value: BigDecimal)
case class SimpleAssetReportDTO(id: Option[Long], value: Seq[SimpleAssetReportEntry]) extends LongIdentifiable

object SimpleAssetReportEntry {
  implicit val simpleAssetReportEntryWrite = Json.writes[SimpleAssetReportEntry]
}

object SimpleAssetReportDTO {
  implicit val simpleAssetReportDTOWrite = Json
    .writes[SimpleAssetReportDTO]
    .removeField("id")
}
