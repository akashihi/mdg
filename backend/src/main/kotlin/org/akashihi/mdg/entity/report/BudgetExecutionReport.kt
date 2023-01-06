package org.akashihi.mdg.entity.report

import com.fasterxml.jackson.annotation.JsonProperty
import java.math.BigDecimal
import java.time.LocalDate

data class BudgetExecutionReport(
    val dates: Collection<LocalDate>,
    @field:JsonProperty("actual_income") val actualIncome: Collection<BigDecimal>,
    @field:JsonProperty("actual_expense") val actualExpense: Collection<BigDecimal>,
    @field:JsonProperty("expected_income") val expectedIncome: Collection<BigDecimal>,
    @field:JsonProperty("expected_expense") val expectedExpense: Collection<BigDecimal>,
    val profit: Collection<BigDecimal>
)