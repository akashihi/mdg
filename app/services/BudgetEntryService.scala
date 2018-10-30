package services

import java.time.LocalDate
import java.time.temporal.ChronoUnit

import controllers.dto.BudgetEntryDTO
import models.{Account, Budget, BudgetEntry, ExpenseAccount}

import scala.math.Ordering
import scalaz._
import Scalaz._
import dao.{SqlDatabase, SqlExecutionContext}
import dao.queries.{AccountQuery, BudgetEntryQuery, BudgetQuery}
import util.EitherOps._
import javax.inject.Inject

import scala.concurrent._
import scala.math.BigDecimal.RoundingMode

/**
  * Budget operations service.
  */
class BudgetEntryService @Inject() (protected val sql: SqlDatabase)(implicit ec: SqlExecutionContext) {

  /**
    * Calculates allowed future spendings.
    *
    * @param b      BudgetEntry
    * @param budget related Budget
    * @return allowed future spendings.
    */
  def getEntryAmounts(b: BudgetEntry,
                              forDay: LocalDate,
                              budget: Budget,
                              actual: BigDecimal): Option[BigDecimal] = {
    if (forDay.plusDays(1).isAfter(budget.term_beginning) && forDay.minusDays(1).isBefore(budget.term_end)) { //We need to check equality condition too
      val budgetLength =
        ChronoUnit.DAYS.between(budget.term_beginning.minusDays(1), budget.term_end) //We need to include first day
      val daysLeft =
        ChronoUnit.DAYS.between(forDay.minusDays(1), budget.term_end) //We need to include specified day
      val daysPassed =
        ChronoUnit.DAYS.between(budget.term_beginning.minusDays(1), forDay) //We need to include first day
      val changeAmount = b.even_distribution match {
        case false => None
        case true =>
          b.proration match {
            case Some(false) | None =>
              Some((b.expected_amount - actual) / daysLeft)
            case Some(true) =>
              Some(
                (b.expected_amount / budgetLength) * daysPassed - actual)
          }
      }
      changeAmount
        .map(x => if (x < 0) BigDecimal(0) else x)
        .map(_.setScale(0, RoundingMode.HALF_DOWN))
    } else {
      None
    }
  }

  /**
    * Converts BudgetEntry object to the DTO
    *
    * @param b budget entry object to convert
    * @return Fully filled DTO object
    */
  def entryToDTO(b: BudgetEntry): Future[BudgetEntryDTO] = {
    def calculateAmounts(a: BigDecimal, bdgt: Option[Budget]): (BigDecimal, Option[BigDecimal]) = {
      val entry = bdgt.flatMap(getEntryAmounts(b, LocalDate.now(), _, a))
      (a, entry)
    }

    val budget = OptionT(sql.query(BudgetQuery.find(b.budget_id)))
    val actual = budget.map(BudgetEntryQuery.getActualSpendings(b.account_id, _))
      .flatMapF(sql.query)
      .getOrElse(0)

    val amounts = actual zip budget.run map (calculateAmounts _).tupled

    amounts.flatMap { p =>
      val (actual, normalizedChangeAmount) = p
      val defaultAccount = Account(None, ExpenseAccount, 0, "No account found", 0, hidden = false)
      val account = sql.query(AccountQuery.findById(b.account_id).map(_.getOrElse(defaultAccount)))
      account.map { a =>
        BudgetEntryDTO(b.id,
          b.account_id,
          a.account_type.value,
          a.name,
          b.even_distribution,
          b.proration,
          b.expected_amount,
          actual,
          normalizedChangeAmount)
      }
    }
  }

  /**
    * Lists entries for specified budget.
    *
    * @param budget_id Identity of a budget.
    * @return Sequence of BudgetEntry DTOs.
    */
  def list(budget_id: Long): Future[Seq[BudgetEntryDTO]] =
    sql.query(BudgetEntryQuery.list(budget_id: Long))
      .flatMap(x => Future.sequence(x.map(entryToDTO)))
    .map(_.sortBy(r => (r.account_type, r.account_name))(Ordering.Tuple2(Ordering.String.reverse, Ordering.String)))

  def find(id: Long, budget_id: Long): OptionF[BudgetEntryDTO] = {
    val query = BudgetEntryQuery.find(id, budget_id)
    OptionT(sql.query(query)).flatMapF(entryToDTO)
  }

  /**
    * Replaces values in a specified budget entry.
    *
    * @param id        Identity of a budget entry.
    * @param budget_id Identity of owning budget.
    * @param ed        New value of even_distribution property.
    * @param p         New value of proration property.
    * @param ea        New value of expected_amount property
    * @return Error code or updated BudgetEntry(DTO).
    */
  def edit(id: Long,
           budget_id: Long,
           ed: Option[Boolean],
           p: Option[Boolean],
           ea: Option[BigDecimal]): ErrorF[BudgetEntryDTO] = {
    val proration = ed match {
      case Some(true) => p
      case _ => Some(false)
    }
    val query = BudgetEntryQuery.find(id, budget_id)
    val entry = EitherT(sql.query(query).map(_.fromOption("BUDGETENTRY_NOT_FOUND")))
    val updated = entry.map(x => x.copy(
      even_distribution = ed.getOrElse(x.even_distribution),
      proration = proration,
      expected_amount = ea.getOrElse(x.expected_amount)
    ))

    updated.map(BudgetEntryQuery.update)
      .map(sql.query)
      .flatten
      .flatMap {
        case 1 => updated.map(entryToDTO).flatten
        case _ => EitherT(Future.successful("BUDGETENTRY_BOT_UPDATED".left))
      }
  }
}
