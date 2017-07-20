package services

import java.time.temporal.ChronoUnit
import javax.inject.Inject

import controllers.dto.{BudgetDTO, BudgetOutgoingAmount}
import dao.BudgetDao
import models.Budget

import scala.concurrent._
import scala.concurrent.duration._
import slick.driver.PostgresDriver.api._

import scalaz._
import Scalaz._

/**
  * Budget operations service.
  */
class BudgetService @Inject()(protected val dao: BudgetDao)(
    implicit ec: ExecutionContext) {

  /**
    * Converts Budget object to the DTO
    * @param b budget object to convert
    * @return Fully filled DTO object
    */
  def budgetToDTO(b: Budget): Future[BudgetDTO] = {
    dao.getBudgetTotals(b).map { amount =>
      val (incoming, expectedChange, actualChange) = amount
      BudgetDTO(b.id,
                b.term_beginning,
                b.term_end,
                incoming,
                BudgetOutgoingAmount(incoming + expectedChange,
                                     incoming + actualChange))
    }
  }

  /**
    * Creates new budget.
    * @param budget budget description object.
    * @return budget description object with id.
    */
  def add(budget: Option[Budget]): Either[Future[BudgetDTO], String] = {
    budget match {
      case Some(x) =>
        if (x.term_beginning isAfter x.term_end) {
          Right("BUDGET_INVALID_TERM")
        } else {
          if (ChronoUnit.DAYS.between(x.term_beginning, x.term_end) < 1) {
            Right("BUDGET_SHORT_RANGE")
          } else {
            Await.result(dao.findOverlapping(x.term_beginning, x.term_end),
                         500 millis) match {
              case Some(_) => Right("BUDGET_OVERLAPPING")
              case None => Left(dao.insert(x).flatMap(budgetToDTO))
            }
          }
        }
      case None => Right("BUDGET_DATA_INVALID")
    }
  }

  def list(): Future[Seq[BudgetDTO]] =
    dao.list().flatMap(x => Future.sequence(x.map(budgetToDTO)))

  def find(id: Long): Future[Option[BudgetDTO]] = {
    dao.find(id).flatMap { x =>
      x.map(budgetToDTO) match {
        case Some(f) => f.map(Some(_))
        case None => Future.successful(None)
      }
    }
  }
}

object BudgetService {
  import play.api.libs.concurrent.Execution.Implicits._

  /**
    * Removes budget and all dependent objects.
    *
    * @param id identification of budget to remove.
    * @return either error result, or resultHandler processing result.
    */
  def delete(id: Long): DBIO[\/[String, Int]] = {
    BudgetDao.delete(id).map {
      case 1 => 1.right
      case _ => "BUDGET_NOT_FOUND".left
    }
  }
}
