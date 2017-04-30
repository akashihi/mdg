package models

import java.time.LocalDateTime

/**
  * Transaction entity.
  */
case class Transaction(id: Option[Long],
                       timestamp: LocalDateTime,
                       comment: Option[String])
