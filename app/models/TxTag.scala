package models

import controllers.api.IdentifiableObject.LongIdentifiable
import play.api.libs.json._
import controllers.api.OWritesOps._

/**
  * Tag entity.
  */
case class TxTag(id: Option[Long], txtag: String) extends LongIdentifiable

object TxTag {
  implicit val txtagWrites = Json
    .writes[TxTag]
    .removeField("id")
}
