package services

import javax.inject.Inject

import controllers.dto.BudgetEntryDTO
import dao.BudgetEntryDao
import models.BudgetEntry

import scala.concurrent.{ExecutionContext, Future}

/**
  * Budget operations service.
  */
class BudgetEntryService @Inject()(protected val dao: BudgetEntryDao)(implicit ec: ExecutionContext) {

  /**
    * Converts Budget object to the DTO
    * @param b budget object to convert
    * @return Fully filled DTO object
    */
  def entryToDTO(b: BudgetEntry):BudgetEntryDTO = {
    BudgetEntryDTO(b.id, b.account_id, b.even_distribution, b.proration, b.expected_amount, 0, 0)
  }

  def list(budget_id: Long): Future[Seq[BudgetEntryDTO]] = dao.list(budget_id: Long).map(x => x.map(entryToDTO))
}
