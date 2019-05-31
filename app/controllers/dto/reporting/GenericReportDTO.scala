package controllers.dto.reporting
import controllers.api.IdentifiableObject.StringIdentifiable
import play.api.libs.json._
import controllers.dto.reporting.TotalsReportValue.totalsReportEntryWrite
import controllers.dto.reporting.ReportValueInTime.ReportValueInTimeWrite
import controllers.dto.reporting.ReportIdentifiedValueInTime.reportIdentifiedValueInTimeWrites
import controllers.dto.reporting.BudgetReportEntry.budgetReportEntryWrite

trait ReportValue
case class GenericReportDTO[+V <: ReportValue](id: Option[String], value: Seq[V]) extends StringIdentifiable

object GenericReportDTO {
  implicit val genericReportDTOWrite = new Writes[GenericReportDTO[_]] {
    override def writes(o: GenericReportDTO[_]) : JsValue = {
      val values = o.value.map {
        case totals: TotalsReportValue => totalsReportEntryWrite.writes(totals)
        case budgetEntry: BudgetReportEntry => budgetReportEntryWrite.writes(budgetEntry)
        case valueInTime: ReportValueInTime => ReportValueInTimeWrite.writes(valueInTime)
        case identifiedValueInTime: ReportIdentifiedValueInTime[_] => reportIdentifiedValueInTimeWrites.writes(identifiedValueInTime)
      }
      Json.obj(
        "value" -> values
      )
    }
  }
}
