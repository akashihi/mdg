package models

import play.api.libs.json._
import controllers.OWritesOps._

/**
  * Currency entity
  */
case class Currency (id: Int, code: String, name: String) extends ApiObject

object Currency {
  implicit val currencyWrites = Json.writes[Currency]
    .removeField("id")
}
