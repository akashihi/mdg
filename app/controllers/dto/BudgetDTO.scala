package controllers.dto

import java.time.LocalDate

import controllers.api.IdentifiableObject.LongIdentifiable
import play.api.libs.json._
import controllers.api.OWritesOps._
import models.Budget

/**
  * Budget wrapper.
  */
case class BudgetPairedAmount(expected: BigDecimal, actual: BigDecimal)
case class BudgetState(income: BudgetPairedAmount,
                       expense: BudgetPairedAmount,
                       change: BudgetPairedAmount)
case class BudgetDTO(
    id: Option[Long],
    term_beginning: LocalDate,
    term_end: LocalDate,
    incoming_amount: BigDecimal,
    outgoing_amount: BudgetPairedAmount,
    state: BudgetState
) extends LongIdentifiable

object BudgetDTO {
  implicit val budgetPairedWrites = Json.writes[BudgetPairedAmount]
  implicit val budgetStateWrites = Json.writes[BudgetState]
  implicit val budgetWrites = Json
    .writes[BudgetDTO]
    .removeField("id")

  abstract class TRUE
  abstract class FALSE

  class BudgetDTOBuilder[BB, BI, BIA, BEA, BSI, BSE, BSC](
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
      new BudgetDTOBuilder[TRUE, BI, BIA, BEA, BSI, BSE, BSC](
        Some(budget),
        incoming,
        income_actual,
        expense_actual,
        expected_income,
        expected_expense,
        state_change_expected,
        state_change_actual)

    def withIncoming(incoming: BigDecimal) =
      new BudgetDTOBuilder[BB, TRUE, BIA, BEA, BSI, BSE, BSC](
        budget,
        Some(incoming),
        income_actual,
        expense_actual,
        expected_income,
        expected_expense,
        state_change_expected,
        state_change_actual)

    def withIncome(income_actual: BigDecimal) =
      new BudgetDTOBuilder[BB, BI, TRUE, BEA, BSI, BSE, BSC](
        budget,
        incoming,
        Some(income_actual),
        expense_actual,
        expected_income,
        expected_expense,
        state_change_expected,
        state_change_actual)

    def withExpense(expense_actual: BigDecimal) =
      new BudgetDTOBuilder[BB, BI, BIA, TRUE, BSI, BSE, BSC](
        budget,
        incoming,
        income_actual,
        Some(expense_actual),
        expected_income,
        expected_expense,
        state_change_expected,
        state_change_actual)

    def withExpectedIncome(state_income: BigDecimal) =
      new BudgetDTOBuilder[BB, BI, BIA, BEA, TRUE, BSE, BSC](
        budget,
        incoming,
        income_actual,
        expense_actual,
        Some(state_income),
        expected_expense,
        state_change_expected,
        state_change_actual)

    def withExpectedExpense(state_expense: BigDecimal) =
      new BudgetDTOBuilder[BB, BI, BIA, BEA, BSI, TRUE, BSC](
        budget,
        incoming,
        income_actual,
        expense_actual,
        expected_income,
        Some(state_expense),
        state_change_expected,
        state_change_actual)

    def withStateChange(state_change_expected: BigDecimal,
                        state_change_actual: BigDecimal) =
      new BudgetDTOBuilder[BB, BI, BIA, BEA, BSI, BSE, TRUE](
        budget,
        incoming,
        income_actual,
        expense_actual,
        expected_income,
        expected_expense,
        Some(state_change_expected),
        Some(state_change_actual))
  }

  implicit def enableBuild(
      builder: BudgetDTOBuilder[TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE]) =
    new {
      def build(): BudgetDTO = {
        val budget = builder.budget.get

        val outgoing_expected = builder.incoming.get + builder.expected_income.get - builder.expected_expense.get
        val outgoing_actual = builder.incoming.get + builder.income_actual.get - builder.expense_actual.get
        val outgoing_amount =
          BudgetPairedAmount(outgoing_expected, outgoing_actual)

        val stateIncome = BudgetPairedAmount(builder.expected_income.get,
                                             builder.income_actual.get)
        val stateExpense = BudgetPairedAmount(builder.expected_expense.get,
                                              builder.expense_actual.get)
        val stateChange = BudgetPairedAmount(builder.state_change_expected.get,
                                             builder.state_change_actual.get)
        val state = BudgetState(stateIncome, stateExpense, stateChange)
        new BudgetDTO(budget.id,
                      budget.term_beginning,
                      budget.term_end,
                      builder.incoming.get,
                      outgoing_amount,
                      state)
      }

    }

  def builder() =
    new BudgetDTOBuilder[FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE](None,
                                                                          None,
                                                                          None,
                                                                          None,
                                                                          None,
                                                                          None,
                                                                          None,
                                                                          None)
}
