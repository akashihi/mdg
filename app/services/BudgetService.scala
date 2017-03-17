package services

import javax.inject.Inject

import dao.BudgetDao
import models.Budget

import scala.concurrent._

/**
  * Budget opeartions service.
  */
class BudgetService @Inject()(protected val budgetDao: BudgetDao)(implicit ec: ExecutionContext) {
  /**
    * Creates new budget.
    * @param budget budget description object.
    * @return budget description object with id.
    */
  def add(budget: Budget): Future[Budget] = budgetDao.insert(budget)
}
