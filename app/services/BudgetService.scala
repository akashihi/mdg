package services

import javax.inject.Inject

import controllers.dto.{BudgetDTO, BudgetOutgoingAmount}
import dao.BudgetDao
import models.Budget

import scala.concurrent._

/**
  * Budget opeartions service.
  */
class BudgetService @Inject()(protected val budgetDao: BudgetDao)(implicit ec: ExecutionContext) {

  /**
    * Converts Budget object to the DTO
    * @param b budget object to convert
    * @return Fully filled DTO object
    */
  def budgetToDTO(b: Budget):BudgetDTO = {
    BudgetDTO(b.id, b.term_beginning, b.term_end, 0, BudgetOutgoingAmount(0, 0))
  }

  /**
    * Creates new budget.
    * @param budget budget description object.
    * @return budget description object with id.
    */
  def add(budget: Budget): Future[BudgetDTO] = budgetDao.insert(budget).map(budgetToDTO)

  def list(): Future[Seq[BudgetDTO]] = budgetDao.list().map(x => x.map(budgetToDTO))
}
