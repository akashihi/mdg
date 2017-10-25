package controllers.dto

import play.api.libs.json._

/**
  * Operation entity simplified wrapper
  */
case class OperationDto(account_id: Long,
                        amount: BigDecimal,
                        rate: Option[BigDecimal])

object OperationDto {
  implicit val operationDtoRead = Json.reads[OperationDto]
  implicit val operationDtoWrites = Json.writes[OperationDto]
}
