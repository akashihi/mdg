package models

import java.time.LocalDateTime

import controllers.api.IdentifiableObject.LongIdentifiable
import play.api.libs.json.Json
import controllers.api.OWritesOps._

/**
  * Rate entity.
  */
case class Rate(id: Option[Long],
                beginning: LocalDateTime,
                end: LocalDateTime,
                from_currency: Long,
                to_currency: Long,
                rate: BigDecimal)
    extends LongIdentifiable

object Rate {
  implicit val rateWrites = Json
    .writes[Rate]
    .removeField("id")
}
