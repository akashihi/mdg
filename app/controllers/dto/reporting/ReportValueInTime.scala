package controllers.dto.reporting
import java.time.LocalDate

import play.api.libs.json.Json

case class ReportValueInTime(date: LocalDate, value: BigDecimal) extends ReportValue

object ReportValueInTime {
  implicit val ReportValueInTimeWrite = Json.writes[ReportValueInTime]
}
