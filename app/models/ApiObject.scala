package models

import play.api.libs.json.Writes
import models.Currency.currencyWrites

/**
  * Base type for all api objects.
  */
trait ApiObject{
  def id: Int
}

object ApiObject {
  implicit val apiObjectWrites = Writes[ApiObject] {
    case currency: Currency => currencyWrites.writes(currency)
  }

}