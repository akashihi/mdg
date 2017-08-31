package models

import controllers.api.IdentifiableObject.StringIdentifiable
import play.api.libs.json._
import controllers.api.OWritesOps._

/**
  * Currency entity
  */
case class Setting(id: Option[String], value: String)
  extends StringIdentifiable

object Setting {
  implicit val settingWrites = Json
    .writes[Setting]
    .removeField("id")
}
