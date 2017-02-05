package models

import java.time.LocalDateTime

/**
  * Transaction entity.
  */
case class Transaction (id: Long, timestamp: LocalDateTime, tags: Seq[String])

