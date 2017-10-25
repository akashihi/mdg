package validators

import java.time.temporal.ChronoUnit

import models.Budget
import Validator._

import scalaz.Scalaz._

object BudgetValidator {
  def budgetPeriodNotInverted(b: Budget): BudgetValidation = {
    if (b.term_beginning isAfter b.term_end) {
      "BUDGET_INVALID_TERM".failureNel
    } else {
      b.success
    }
  }

  def budgetPeriodNotShort(b: Budget): BudgetValidation = {
    if (ChronoUnit.DAYS.between(b.term_beginning, b.term_end) < 1) {
      "BUDGET_SHORT_RANGE".failureNel
    } else {
      b.success
    }
  }
}
