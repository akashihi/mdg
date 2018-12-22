package controllers.dto.reporting
import controllers.api.IdentifiableObject.StringIdentifiable
import play.api.libs.json._
import controllers.dto.reporting.TotalsReportEntry.totalsReportEntryWrite
import controllers.dto.reporting.SimpleAssetReportEntry.simpleAssetReportEntryWrite

trait GenericReportEntry
case class GenericReportDTO[+V <: GenericReportEntry](id: Option[String], value: Seq[V]) extends StringIdentifiable

object GenericReportDTO {
  implicit val genericReportDTOWrite = new Writes[GenericReportDTO[_]] {
    override def writes(o: GenericReportDTO[_]) : JsValue = {
      val values = o.value.map {
        case totals: TotalsReportEntry => totalsReportEntryWrite.writes(totals)
        case simpleAsset: SimpleAssetReportEntry => simpleAssetReportEntryWrite.writes(simpleAsset)
      }
      Json.obj(
        "attributes" -> values, "type" -> "report"
      )
    }
  }
}
