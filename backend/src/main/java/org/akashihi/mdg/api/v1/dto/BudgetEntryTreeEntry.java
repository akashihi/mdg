package org.akashihi.mdg.api.v1.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.akashihi.mdg.entity.BudgetEntry;

import java.math.BigDecimal;
import java.util.Collection;

public record BudgetEntryTreeEntry(@JsonInclude(JsonInclude.Include.NON_NULL) Long id,
                                   @JsonInclude(JsonInclude.Include.NON_NULL) String name,
                                   @JsonProperty("actual_amount") BigDecimal actualAmount,
                                   @JsonProperty("expected_amount") BigDecimal expectedAmount,
                                   @JsonProperty("allowed_spendings") BigDecimal allowedSpendings,
                                   @JsonProperty("spending_percent") BigDecimal spendingPercent,
                                   Collection<BudgetEntry> entries,
                                   Collection<BudgetEntryTreeEntry> categories) {
}
