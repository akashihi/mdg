package dao.filters

import play.api.libs.json._

/**
  * Account filtering operations.
  */
case class AccountFilter(account_type: Option[String],
                         currency_id: Option[Long],
                         name: Option[String],
                         hidden: Option[Boolean])
object EmptyAccountFilter extends AccountFilter(None, None, None, None)

object AccountFilter {
  implicit val accountFilterRead = Json.reads[AccountFilter]
}
