package controllers.dto

import java.time.LocalDateTime

import controllers.api.IdentifiableObject.LongIdentifiable
import play.api.libs.json._
import controllers.api.OWritesOps._

/**
  * Transaction wrapper.
  */
case class TransactionDto(
    id: Option[Long],
    timestamp: LocalDateTime,
    comment: Option[String],
    tags: Seq[String] = Seq(),
    operations: Seq[OperationDto] = Seq()
) extends LongIdentifiable

object TransactionDto {
  implicit val localDateTimeFormat = new Format[LocalDateTime] {
    override def reads(json: JsValue): JsResult[LocalDateTime] =
      json.validate[String].map(LocalDateTime.parse)

    override def writes(o: LocalDateTime): JsValue = Json.toJson(o.toString)
  }

  implicit val transactionRead = Json.reads[TransactionDto]

  implicit val transactionWrites = Json
    .writes[TransactionDto]
    .removeField("id")
}

case class TransactionAttributeDto(`type`: String, attributes: TransactionDto)
object TransactionAttributeDto {
  implicit val transactionAttributesRead = Json.reads[TransactionAttributeDto]
  implicit val transactionAttributesWrites =
    Json.writes[TransactionAttributeDto]
}

case class TransactionWrapperDto(data: TransactionAttributeDto)

object TransactionWrapperDto {
  implicit val transactionWrapperRead = Json.reads[TransactionWrapperDto]
  implicit val transactionWrapperWrites = Json.writes[TransactionWrapperDto]
}
