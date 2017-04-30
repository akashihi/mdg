package models

import play.api.libs.json._

/**
  * Error entity
  */
case class Error(code: String,
                 status: String,
                 title: String,
                 detail: Option[String])

object Error {
  implicit val errorWrites = Json.writes[Error]
}
