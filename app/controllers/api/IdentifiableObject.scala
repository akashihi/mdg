package controllers.api

import controllers.dto.CategoryDTO.categoryDtoWrites
import controllers.dto.AccountDTO.accountDtoWrites
import controllers.dto.BudgetDTO.budgetWrites
import controllers.dto.BudgetEntryDTO.budgetEntryWrites
import controllers.dto.TransactionDto.transactionWrites
import controllers.dto.reporting.GenericReportDTO
import controllers.dto.reporting.GenericReportDTO.genericReportDTOWrite
import controllers.dto._
import models.Currency.currencyWrites
import models.TxTag.txtagWrites
import models.Setting.settingWrites
import models.Rate.rateWrites
import models._
import play.api.libs.json.Writes

/**
  * Base type for all api objects.
  */
trait ApiObject

trait IdentifiableObject[T] {
  def id: Option[T]
}

object IdentifiableObject {
  type LongIdentifiable = IdentifiableObject[Long]
  type StringIdentifiable = IdentifiableObject[String]

  implicit val apiObjectWrites = Writes[IdentifiableObject[_]] {
    case currency: Currency => currencyWrites.writes(currency)
    case category: CategoryDTO => categoryDtoWrites.writes(category)
    case account: AccountDTO => accountDtoWrites.writes(account)
    case transaction: TransactionDto => transactionWrites.writes(transaction)
    case budget: BudgetDTO => budgetWrites.writes(budget)
    case budgetentry: BudgetEntryDTO => budgetEntryWrites.writes(budgetentry)
    case tag: TxTag => txtagWrites.writes(tag)
    case setting: Setting => settingWrites.writes(setting)
    case rate: Rate => rateWrites.writes(rate)
    case report: GenericReportDTO[_] => genericReportDTOWrite.writes(report)
  }
}
