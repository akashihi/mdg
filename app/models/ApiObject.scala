package models

import play.api.libs.json.Writes
import models.Currency.currencyWrites
import models.Account.accountWrites

/**
  * Base type for all api objects.
  */
trait ApiObject{
  def id: Long
}

object ApiObject {
  implicit val apiObjectWrites = Writes[ApiObject] {
    case currency: Currency => currencyWrites.writes(currency)
    case account: Account => accountWrites.writes(account)
  }
}
