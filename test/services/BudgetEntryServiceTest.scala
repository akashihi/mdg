package services

import java.time.LocalDate

import models._
import org.scalatest.prop._
import tests.ParameterizedSpec

trait SpendingParameters extends Tables {
  val budget = Budget(Some(1L), LocalDate.parse("2018-09-01"), LocalDate.parse("2018-09-30"))

  def parameters = Table(
    ("BudgetEntry", "Day of interest", "Budget", "Actual spendings", "Expected result"),
    (BudgetEntry(Some(1L), 1L, 1L), LocalDate.parse("2018-08-31"), budget, BigDecimal(0), None),
    (BudgetEntry(Some(1L), 1L, 1L), LocalDate.parse("2018-10-01"), budget, BigDecimal(0), None),
    (BudgetEntry(Some(1L), 1L, 1L, even_distribution = false), LocalDate.parse("2018-09-01"), budget, BigDecimal(0), None),
    (BudgetEntry(Some(1L), 1L, 1L, even_distribution = false), LocalDate.parse("2018-09-15"), budget, BigDecimal(0), None),
    (BudgetEntry(Some(1L), 1L, 1L, even_distribution = false), LocalDate.parse("2018-09-30"), budget, BigDecimal(0), None),
    (BudgetEntry(Some(1L), 1L, 1L, even_distribution = false), LocalDate.parse("2018-09-30"), budget, BigDecimal(0), None),
    (BudgetEntry(Some(1L), 1L, 1L, even_distribution = true, Some(false), BigDecimal(3000)), LocalDate.parse("2018-09-01"), budget, BigDecimal(0), Some(BigDecimal(100))),
    (BudgetEntry(Some(1L), 1L, 1L, even_distribution = true, Some(false), BigDecimal(3000)), LocalDate.parse("2018-09-16"), budget, BigDecimal(0), Some(BigDecimal(200))),
    (BudgetEntry(Some(1L), 1L, 1L, even_distribution = true, Some(false), BigDecimal(3000)), LocalDate.parse("2018-09-30"), budget, BigDecimal(0), Some(BigDecimal(3000))),
    (BudgetEntry(Some(1L), 1L, 1L, even_distribution = true, Some(false), BigDecimal(3000)), LocalDate.parse("2018-09-16"), budget, BigDecimal(1500), Some(BigDecimal(100))),
    (BudgetEntry(Some(1L), 1L, 1L, even_distribution = true, Some(true), BigDecimal(3000)), LocalDate.parse("2018-09-01"), budget, BigDecimal(0), Some(BigDecimal(100))),
    (BudgetEntry(Some(1L), 1L, 1L, even_distribution = true, Some(true), BigDecimal(3000)), LocalDate.parse("2018-09-15"), budget, BigDecimal(0), Some(BigDecimal(1500))),
    (BudgetEntry(Some(1L), 1L, 1L, even_distribution = true, Some(true), BigDecimal(3000)), LocalDate.parse("2018-09-30"), budget, BigDecimal(0), Some(BigDecimal(3000))),
    (BudgetEntry(Some(1L), 1L, 1L, even_distribution = true, Some(true), BigDecimal(3000)), LocalDate.parse("2018-09-16"), budget, BigDecimal(1000), Some(BigDecimal(600))),
    (BudgetEntry(Some(1L), 1L, 1L, even_distribution = true, Some(true), BigDecimal(3000)), LocalDate.parse("2018-09-16"), budget, BigDecimal(1600), Some(BigDecimal(0))),
    (BudgetEntry(Some(1L), 1L, 1L, even_distribution = true, Some(true), BigDecimal(3000)), LocalDate.parse("2018-09-16"), budget, BigDecimal(2000), Some(BigDecimal(0)))
  )
}

class BudgetEntryServiceTest extends ParameterizedSpec {
  property("Future spendings should be calculated properly") {
    new SpendingParameters {
      forAll(parameters) {
            val bes = new BudgetEntryService(null)(null)
        (entry: BudgetEntry, day: LocalDate, budget: Budget, actual: BigDecimal, result: Option[BigDecimal]) =>
          bes.getEntryAmounts(entry, day, budget, actual) should be(result)
      }
    }
  }
}
