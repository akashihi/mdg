package controllers.dto

import play.api.libs.json._
import controllers.api.OWritesOps._

import models.ApiObject

/**
  * BudgeEntry wrapper.
  */
case class BudgetEntryDTO(id: Option[Long],
                          account_id: Long,
                          even_distribution: Boolean,
                          proration: Option[Boolean],
                          expected_amount: BigDecimal,
                          actual_amount: BigDecimal,
                          change_amount: BigDecimal
                         ) extends ApiObject

object BudgetEntryDTO {
  implicit val budgetEntryWrites = Json.writes[BudgetEntryDTO]
    .removeField("id")
}
