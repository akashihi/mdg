package models

/**
  * Operation entity.
  */
case class Operation (id: Long, txId: Long, account_id: Long, amount: BigDecimal)
