package services

import java.time.LocalDate
import java.time.temporal.ChronoUnit

import controllers.dto.BudgetEntryDTO
import dao.{BudgetDao, BudgetEntryDao}
import models.{Budget, BudgetEntry}
import slick.driver.PostgresDriver.api._

import play.api.libs.concurrent.Execution.Implicits._

import scalaz._
import Scalaz._

/**
  * Budget operations service.
  */
object BudgetEntryService {

  /**
    * Finds amount spent on BudgetEntry anow allowed future spendings.
    * @param b BudgetEntry
    * @param budget related Budget
    * @return tuple of actual spendings, allowed future spendings.
    */
  private def getEntryAmounts(
      b: BudgetEntry,
      budget: Budget): DBIO[(BigDecimal, Option[BigDecimal])] = {
    val budgetLength =
      ChronoUnit.DAYS.between(budget.term_beginning, budget.term_end)
    val daysLeft =
      ChronoUnit.DAYS.between(LocalDate.now(), budget.term_end)
    BudgetEntryDao.getActualSpendings(b.account_id, budget).map { actual =>
      val changeAmount = b.even_distribution match {
        case false => None
        case true =>
          b.proration match {
            case Some(true) =>
              Some((b.expected_amount - actual) / daysLeft)
            case Some(false) | None =>
              Some(
                b.expected_amount - actual - (b.expected_amount / budgetLength) * daysLeft)
          }
      }
      val normalizedChangeAmount =
        changeAmount.map(x => if (x < 0) BigDecimal(0) else x)
      (actual, normalizedChangeAmount)
    }
  }

  /**
    * Converts BudgetEntry object to the DTO
    * @param b budget entry object to convert
    * @return Fully filled DTO object
    */
  def entryToDTO(b: BudgetEntry): DBIO[BudgetEntryDTO] = {
    /*.map {
      case Some(budget) => if (LocalDate.now().isAfter(budget.term_beginning) && LocalDate.now().isBefore(budget.term_end)) {
        Some(budget)
      } else {
        None
      }
    }.*/
    val amounts = BudgetDao.find(b.budget_id).flatMap {
      case None => DBIO.successful((BigDecimal(0), None))
      case Some(budget) => {
        BudgetEntryDao.getActualSpendings(b.account_id, budget).map { actual =>
          if (LocalDate.now().isAfter(budget.term_beginning) && LocalDate.now().isBefore(budget.term_end)) {
            (actual, None)
          } else {
            val budgetLength =
              ChronoUnit.DAYS.between(budget.term_beginning, budget.term_end)
            val daysLeft =
              ChronoUnit.DAYS.between(LocalDate.now(), budget.term_end)
            val changeAmount = b.even_distribution match {
              case false => None
              case true =>
                b.proration match {
                  case Some(true) =>
                    Some((b.expected_amount - actual) / daysLeft)
                  case Some(false) | None =>
                    Some(
                      b.expected_amount - actual - (b.expected_amount / budgetLength) * daysLeft)
                }
            }
            val normalizedChangeAmount =
              changeAmount.map(x => if (x < 0) BigDecimal(0) else x)
            (actual, normalizedChangeAmount)
          }
        }
      }
    }
    amounts.map { p =>
      val (actual, normalizedChangeAmount) = p
      BudgetEntryDTO(b.id,
                     b.account_id,
                     b.even_distribution,
                     b.proration,
                     b.expected_amount,
                     actual,
                     normalizedChangeAmount)
    }
  }

  /**
    * Lists entries for specified budget.
    * @param budget_id Identity of a budget.
    * @return Sequence of BudgetEntry DTOs.
    */
  def list(budget_id: Long): DBIO[Seq[BudgetEntryDTO]] =
    BudgetEntryDao
      .list(budget_id: Long)
      .flatMap(x => DBIO.sequence(x.map(entryToDTO)))

  def find(id: Long, budget_id: Long): DBIO[Option[BudgetEntryDTO]] = {
    BudgetEntryDao.find(id, budget_id).flatMap { x =>
      x.map(entryToDTO) match {
        case Some(f) => f.map(Some(_))
        case None => DBIO.successful(None)
      }
    }
  }

  /**
    * Replaces values in a specified budget entry.
    * @param id Identity of a budget entry.
    * @param budget_id Identity of owning budget.
    * @param ed New value of even_distribution property.
    * @param p New value of proration property.
    * @param ea New value of expected_amount property
    * @return Error code or updated BudgetEntry(DTO).
    */
  def edit(id: Long,
           budget_id: Long,
           ed: Option[Boolean],
           p: Option[Boolean],
           ea: Option[BigDecimal]): DBIO[\/[String, BudgetEntryDTO]] = {
    BudgetEntryDao.find(id, budget_id).flatMap {
      case None => DBIO.successful("BUDGETENTRY_NOT_FOUND".left)
      case Some(x) =>
        val updated = x.copy(even_distribution =
                               ed.getOrElse(x.even_distribution),
                             proration = p,
                             expected_amount = ea.getOrElse(x.expected_amount))
        BudgetEntryDao.update(updated).flatMap {
          case 1 => entryToDTO(updated).map(_.right)
          case _ => DBIO.successful("BUDGETENTRY_BOT_UPDATED".left)
        }
    }
  }
}
