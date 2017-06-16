package models

import controllers.api.IdentifiableObject
import play.api.libs.json._
import controllers.api.OWritesOps._

/**
  * Tag entity.
  */
case class TxTag(id: Option[Long], txtag: String) extends IdentifiableObject

object TxTag {
  implicit val txtagWrites = Json
    .writes[TxTag]
    .removeField("id")
}
