package models

import java.time.LocalDate
import play.api.libs.json._
import controllers.OWritesOps._

/**
  * Budget entity.
  */
case class BudgetOutgoingAmount(expected: BigDecimal, actual: BigDecimal)
case class Budget (
                    id: Option[Long],
                    term_beginning: LocalDate,
                    term_end: LocalDate,
                    incoming_amount: BigDecimal,
                    outgoingAmount: BudgetOutgoingAmount
                  ) extends ApiObject

object Budget {
  implicit val budgetOutgoingWrites = Json.writes[BudgetOutgoingAmount]
  implicit val budgetWrites = Json.writes[Budget]
    .removeField("id")
}
