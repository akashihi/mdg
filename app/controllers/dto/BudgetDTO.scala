package controllers.dto

import java.time.LocalDate

import controllers.api.IdentifiableObject.LongIdentifiable
import play.api.libs.json._
import controllers.api.OWritesOps._
import models.Budget

/**
  * Budget wrapper.
  */
case class BudgetPair(expected: BigDecimal, actual: BigDecimal)
case class BudgetState(income: BudgetPair,
                       expense: BudgetPair,
                       change: BudgetPair)
case class BudgetDTO(
    id: Option[Long],
    term_beginning: LocalDate,
    term_end: LocalDate,
    incoming_amount: Option[BigDecimal],
    outgoing_amount: Option[BudgetPair],
    state: Option[BudgetState]
) extends LongIdentifiable

object BudgetDTO {
  implicit val budgetPairWrites = Json.writes[BudgetPair]
  implicit val budgetStateWrites = Json.writes[BudgetState]
  implicit val budgetWrites = Json
    .writes[BudgetDTO]
    .removeField("id")

  abstract class TRUE
  abstract class FALSE

  class BudgetDTOBuilder[BB](
      val budget: Option[Budget],
      val incoming: Option[BigDecimal],
      val income_actual: Option[BigDecimal],
      val expense_actual: Option[BigDecimal],
      val expected_income: Option[BigDecimal],
      val expected_expense: Option[BigDecimal],
      val state_change_expected: Option[BigDecimal],
      val state_change_actual: Option[BigDecimal]
  ) {
    def withBudget(budget: Budget) =
      new BudgetDTOBuilder[TRUE](Some(budget),
                                 incoming,
                                 income_actual,
                                 expense_actual,
                                 expected_income,
                                 expected_expense,
                                 state_change_expected,
                                 state_change_actual)

    def withIncoming(incoming: BigDecimal) =
      new BudgetDTOBuilder[BB](budget,
                               Some(incoming),
                               income_actual,
                               expense_actual,
                               expected_income,
                               expected_expense,
                               state_change_expected,
                               state_change_actual)

    def withIncome(income_actual: BigDecimal) =
      new BudgetDTOBuilder[BB](budget,
                               incoming,
                               Some(income_actual),
                               expense_actual,
                               expected_income,
                               expected_expense,
                               state_change_expected,
                               state_change_actual)

    def withExpense(expense_actual: BigDecimal) =
      new BudgetDTOBuilder[BB](budget,
                               incoming,
                               income_actual,
                               Some(expense_actual),
                               expected_income,
                               expected_expense,
                               state_change_expected,
                               state_change_actual)

    def withExpectedIncome(state_income: BigDecimal) =
      new BudgetDTOBuilder[BB](budget,
                               incoming,
                               income_actual,
                               expense_actual,
                               Some(state_income),
                               expected_expense,
                               state_change_expected,
                               state_change_actual)

    def withExpectedExpense(state_expense: BigDecimal) =
      new BudgetDTOBuilder[BB](budget,
                               incoming,
                               income_actual,
                               expense_actual,
                               expected_income,
                               Some(state_expense),
                               state_change_expected,
                               state_change_actual)

    def withStateChange(state_change_expected: BigDecimal,
                        state_change_actual: BigDecimal) =
      new BudgetDTOBuilder[BB](budget,
                               incoming,
                               income_actual,
                               expense_actual,
                               expected_income,
                               expected_expense,
                               Some(state_change_expected),
                               Some(state_change_actual))
  }

  implicit def enableBuild(builder: BudgetDTOBuilder[TRUE]) =
    new {
      private def makeBudgetPair(expected: Option[BigDecimal], actual: Option[BigDecimal]) = {
        for {
          e <- expected
          a <- actual
        } yield BudgetPair(e, a)
      }
      def build(): BudgetDTO = {
        val budget = builder.budget.get

        val outgoing_expected = for {
          i <- builder.incoming
          ei <- builder.expected_income
          ee <- builder.expected_expense
          } yield i + ei - ee

          val outgoing_actual = for {
            i <- builder.incoming
            ia <- builder.income_actual
            ea <- builder.expense_actual
            } yield i + ia - ea
          val outgoing_amount = makeBudgetPair(outgoing_expected, outgoing_actual)

          val stateIncome = makeBudgetPair(builder.expected_income, builder.income_actual)
          val stateExpense = makeBudgetPair(builder.expected_expense, builder.expense_actual)

          val stateChange = makeBudgetPair(builder.state_change_expected, builder.state_change_actual)

          val state = for {
            income <- stateIncome
            expense <- stateExpense
            change <- stateChange
          } yield BudgetState(income, expense, change)

          new BudgetDTO(budget.id,
            budget.term_beginning,
            budget.term_end,
            builder.incoming,
            outgoing_amount,
            state)
        }
      }

  def builder() =
    new BudgetDTOBuilder[FALSE](None, None, None, None, None, None, None, None)
}
