package services

import controllers.dto.{BudgetDTO, BudgetOutgoingAmount}
import dao.BudgetDao
import models.Budget

import slick.driver.PostgresDriver.api._

import util.Validator._

import scalaz._
import Scalaz._
import play.api.libs.concurrent.Execution.Implicits._

/**
  * Budget operations service.
  */
object BudgetService {

  /**
    * Converts Budget object to the DTO
    * @param b budget object to convert
    * @return Fully filled DTO object
    */
  def budgetToDTO(b: Budget): DBIO[BudgetDTO] = {
    BudgetDao.getBudgetTotals(b).map { amount =>
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
  def add(budget: Option[Budget]): DBIO[\/[String, BudgetDTO]] = {
    val b = budget match {
      case Some(x) => x.right
      case None => "BUDGET_DATA_INVALID".left
    }
    val v = b
      .map { validate }
      .flatMap { validationToXor }
      .map(x =>
        BudgetDao.findOverlapping(x.term_beginning, x.term_end).map {
          case Some(_) => "BUDGET_OVERLAPPING".left
          case None => x.right
      })

    val z = v match {
      case -\/(e) => DBIO.successful(e.left)
      case \/-(e) => e.map(_.right)
    }
    val d = z.map(_.flatMap(identity))
    def budgetSave(bbb: Budget): DBIO[BudgetDTO] = {
      BudgetDao.insert(bbb).flatMap(budgetToDTO)
    }
    val s = d.map(_.map(BudgetDao.insert(_).flatMap(budgetToDTO)))
    val f = s.map {
      case -\/(e) => DBIO.successful(e.left)
      case \/-(e) => e.map(_.right)
    }
    f.flatMap(identity)
  }

  def list(): DBIO[Seq[BudgetDTO]] =
    BudgetDao.list().flatMap(x => DBIO.sequence(x.map(budgetToDTO)))

  /**
    * Retrieves specific Budget.
    * @param id transaction unique id.
    * @return DTO object.
    */
  def get(id: Long): DBIO[Option[BudgetDTO]] = {
    BudgetDao.find(id).flatMap { x =>
      x.map(budgetToDTO) match {
        case Some(f) => f.map(Some(_))
        case None => DBIO.successful(None)
      }
    }
  }

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
