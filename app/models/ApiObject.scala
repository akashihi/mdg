package models

import controllers.dto.TransactionDto
import play.api.libs.json.Writes
import models.Currency.currencyWrites
import models.Account.accountWrites
import controllers.dto.TransactionDto.transactionWrites

/**
  * Base type for all api objects.
  */
trait ApiObject{
  def id: Option[Long]
}

object ApiObject {
  implicit val apiObjectWrites = Writes[ApiObject] {
    case currency: Currency => currencyWrites.writes(currency)
    case account: Account => accountWrites.writes(account)
    case transaction: TransactionDto => transactionWrites.writes(transaction)
  }
}
