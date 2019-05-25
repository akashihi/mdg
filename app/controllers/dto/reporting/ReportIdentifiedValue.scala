package controllers.dto.reporting
import play.api.libs.json._

case class ReportIdentifiedValue[T](value: BigDecimal, id: T) extends ReportValue

object ReportIdentifiedValue {
  implicit val reportIdentifiedValueWrites = new Writes[ReportIdentifiedValue[_]] {
    override def writes(o: ReportIdentifiedValue[_]): JsValue = {
      Json.obj(
        "value" -> o.value,
        "id" -> o.id.toString
      )
    }
  }
}