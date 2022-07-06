package org.akashihi.mdg.entity.report;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;

public record BudgetExecutionReport(Collection<LocalDate> dates,
                                    @JsonProperty("actual_income") Collection<BigDecimal> actualIncome,
                                    @JsonProperty("actual_expense") Collection<BigDecimal> actualExpense,
                                    @JsonProperty("expected_income") Collection<BigDecimal> expectedIncome,
                                    @JsonProperty("expected_expense") Collection<BigDecimal> expectedExpense,
                                    Collection<BigDecimal> profit) {
}
