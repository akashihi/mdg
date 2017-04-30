package controllers.api

import controllers.dto.BudgetDTO.budgetWrites
import controllers.dto.BudgetEntryDTO.budgetEntryWrites
import controllers.dto.TransactionDto.transactionWrites
import controllers.dto.{BudgetDTO, BudgetEntryDTO, TransactionDto}
import models.Account.accountWrites
import models.Currency.currencyWrites
import models.{Account, Currency}
import play.api.libs.json.Writes

/**
  * Base type for all api objects.
  */
trait ApiObject {
  def id: Option[Long]
}

object ApiObject {
  implicit val apiObjectWrites = Writes[ApiObject] {
    case currency: Currency => currencyWrites.writes(currency)
    case account: Account => accountWrites.writes(account)
    case transaction: TransactionDto => transactionWrites.writes(transaction)
    case budget: BudgetDTO => budgetWrites.writes(budget)
    case budgetentry: BudgetEntryDTO => budgetEntryWrites.writes(budgetentry)
  }
}
