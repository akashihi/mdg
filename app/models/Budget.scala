package models

import java.time.LocalDate

/**
  * Budget entity.
  */

case class Budget(id: Option[Long],term_beginning: LocalDate,term_end: LocalDate)
