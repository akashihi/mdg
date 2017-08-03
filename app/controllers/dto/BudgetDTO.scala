package controllers.dto

import java.time.LocalDate

import controllers.api.IdentifiableObject
import play.api.libs.json._
import controllers.api.OWritesOps._

/**
  * Budget wrapper.
  */
case class BudgetPairedAmount(expected: BigDecimal, actual: BigDecimal)
case class BudgetState(income: BudgetPairedAmount, expense: BudgetPairedAmount, change: BudgetPairedAmount)
case class BudgetDTO(
    id: Option[Long],
    term_beginning: LocalDate,
    term_end: LocalDate,
    incoming_amount: BigDecimal,
    outgoing_amount: BudgetPairedAmount,
    state: BudgetState
) extends IdentifiableObject

object BudgetDTO {
  implicit val budgetPairedWrites = Json.writes[BudgetPairedAmount]
  implicit val budgetStateWrites = Json.writes[BudgetState]
  implicit val budgetWrites = Json
    .writes[BudgetDTO]
    .removeField("id")
}
