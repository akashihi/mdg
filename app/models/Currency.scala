package models

import controllers.api.IdentifiableObject
import play.api.libs.json._
import controllers.api.OWritesOps._

/**
  * Currency entity
  */
case class Currency(id: Option[Long], code: String, name: String)
    extends IdentifiableObject

object Currency {
  implicit val currencyWrites = Json
    .writes[Currency]
    .removeField("id")
}
