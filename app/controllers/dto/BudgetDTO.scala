package controllers.dto

import java.time.LocalDate

import controllers.api.IdentifiableObject
import play.api.libs.json._
import controllers.api.OWritesOps._

/**
  * Budget wrapper.
  */
case class BudgetOutgoingAmount(expected: BigDecimal, actual: BigDecimal)
case class BudgetDTO(
    id: Option[Long],
    term_beginning: LocalDate,
    term_end: LocalDate,
    incoming_amount: BigDecimal,
    outgoing_amount: BudgetOutgoingAmount
) extends IdentifiableObject

object BudgetDTO {
  implicit val budgetOutgoingWrites = Json.writes[BudgetOutgoingAmount]
  implicit val budgetWrites = Json
    .writes[BudgetDTO]
    .removeField("id")
}
