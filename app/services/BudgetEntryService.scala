package services

import java.time.LocalDate
import java.time.temporal.ChronoUnit
import javax.inject.Inject

import controllers.dto.BudgetEntryDTO
import dao.BudgetEntryDao
import models.BudgetEntry

import scala.concurrent._

/**
  * Budget operations service.
  */
class BudgetEntryService @Inject()(
    protected val dao: BudgetEntryDao)(implicit ec: ExecutionContext) {

  /**
    * Converts Budget object to the DTO
    * @param b budget object to convert
    * @return Fully filled DTO object
    */
  def entryToDTO(b: BudgetEntry): Future[BudgetEntryDTO] = {
    Future.successful(
      BudgetEntryDTO(b.id,
        b.account_id,
        b.even_distribution,
        b.proration,
        b.expected_amount,
        0,
        None))
    /*budgetDao.find(b.budget_id).flatMap {
      case None =>
        Future.successful(
          BudgetEntryDTO(b.id,
                         b.account_id,
                         b.even_distribution,
                         b.proration,
                         b.expected_amount,
                         0,
                         None))
      case Some(budget) =>
        dao.getActualSpendings(b.account_id, budget).map { actual =>
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
          BudgetEntryDTO(b.id,
                         b.account_id,
                         b.even_distribution,
                         b.proration,
                         b.expected_amount,
                         actual,
                         normalizedChangeAmount)
        }
    }*/
  }

  def list(budget_id: Long): Future[Seq[BudgetEntryDTO]] =
    dao.list(budget_id: Long).flatMap(x => Future.sequence(x.map(entryToDTO)))

  def find(id: Long, budget_id: Long): Future[Option[BudgetEntryDTO]] = {
    dao.find(id, budget_id).flatMap { x =>
      x.map(entryToDTO) match {
        case Some(f) => f.map(Some(_))
        case None => Future.successful(None)
      }
    }
  }

  def edit(id: Long,
           budget_id: Long,
           ed: Option[Boolean],
           p: Option[Boolean],
           ea: Option[BigDecimal]): Future[
    Either[Future[BudgetEntryDTO], String] with Product with Serializable] = {
    dao.find(id, budget_id).flatMap {
      case None => Future(Right("BUDGETENTRY_NOT_FOUND"))
      case Some(x) =>
        val updated = x.copy(even_distribution =
                               ed.getOrElse(x.even_distribution),
                             proration = p,
                             expected_amount = ea.getOrElse(x.expected_amount))
        dao.update(updated).map {
          case Some(entry) => Left(entryToDTO(entry))
          case None => Right("BUDGETENTRY_BOT_UPDATED")
        }
    }
  }
}
