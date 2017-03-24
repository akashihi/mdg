package models

/**
  * Budget entry entity.
  */
case class BudgetEntry(id: Option[Long],
                       budget_id: Long,
                       account_id: Long,
                       even_distribution: Boolean = true,
                       proration: Option[Boolean] = Some(true),
                       expected_amount: BigDecimal = 0)
