package services

import java.time._
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
  def add(budget: Option[Budget]): Either[Future[BudgetDTO], String] = {
    budget match {
      case Some(x) =>
        if ( x.term_beginning isAfter x.term_end ) {
          Right("BUDGET_INVALID_TERM")
        } else {
          if ( Period.between(x.term_beginning, x.term_end).getDays <= 1 ) {
            Right("BUDGET_SHORT_RANGE")
          } else {
            Left(budgetDao.insert(x).map(budgetToDTO))
          }
        }
      case None => Right("BUDGET_DATA_INVALID")
    }
  }

  def list(): Future[Seq[BudgetDTO]] = budgetDao.list().map(x => x.map(budgetToDTO))

  def find(id: Long): Future[Option[BudgetDTO]] = budgetDao.find(id).map(x => x.map(budgetToDTO))

  def delete(id: Long): Future[Option[Int]] = budgetDao.delete(id)
}
