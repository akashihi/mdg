package services

import javax.inject.Inject
import play.api.mvc._

import controllers.dto.BudgetEntryDTO
import dao.BudgetEntryDao
import models.BudgetEntry

import scala.concurrent._

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

  def find(id: Long, budget_id: Long): Future[Option[BudgetEntryDTO]] = dao.find(id, budget_id).map(x => x.map(entryToDTO))

  def edit(id: Long, budget_id: Long,
           ed: Option[Boolean], p: Option[Boolean], ea: Option[BigDecimal]): Future[Either[BudgetEntryDTO, String]]= {
    dao.find(id, budget_id).flatMap {
      case None => Future(Right("BUDGETENTRY_NOT_FOUND"))
      case Some(x) =>
        val updated = x.copy(even_distribution = ed.getOrElse(x.even_distribution), proration = p, expected_amount = ea.getOrElse(x.expected_amount))
        dao.update(updated).map {
          case Some(entry) => Left(entryToDTO(entry))
          case None => Right("BUDGETENTRY_BOT_UPDATED")
        }
    }
  }
}
