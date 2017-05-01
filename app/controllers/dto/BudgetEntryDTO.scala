package controllers.dto

import controllers.api.IdentifiableObject
import play.api.libs.json._
import controllers.api.OWritesOps._

/**
  * BudgeEntry wrapper.
  */
case class BudgetEntryDTO(id: Option[Long],
                          account_id: Long,
                          even_distribution: Boolean,
                          proration: Option[Boolean],
                          expected_amount: BigDecimal,
                          actual_amount: BigDecimal,
                          change_amount: Option[BigDecimal])
    extends IdentifiableObject

object BudgetEntryDTO {
  implicit val budgetEntryWrites = Json
    .writes[BudgetEntryDTO]
    .removeField("id")
}
