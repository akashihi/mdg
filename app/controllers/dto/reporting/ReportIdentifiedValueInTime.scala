package controllers.dto.reporting
import java.time.LocalDate

import play.api.libs.json._

case class ReportIdentifiedValueInTime[T](date: LocalDate, value: BigDecimal, id: T) extends ReportValue

object ReportIdentifiedValueInTime {
  implicit val reportIdentifiedValueInTimeWrites = new Writes[ReportIdentifiedValueInTime[_]] {
    override def writes(o: ReportIdentifiedValueInTime[_]): JsValue = {
      Json.obj(
        "date" -> o.date,
        "value" -> o.value,
        "id" -> o.id.toString
      )
    }
  }
}