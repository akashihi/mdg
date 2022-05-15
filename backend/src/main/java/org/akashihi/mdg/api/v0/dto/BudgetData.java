package org.akashihi.mdg.api.v0.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class BudgetData {
    private Long id;
    private String type;
    public record BudgetPair(BigDecimal actual, BigDecimal expected) {}
    public record BudgetState(BudgetPair income, BudgetPair expense, BudgetPair change) {}
    public record Attributes(String term_beginning, String term_end, BigDecimal incoming_amount, BudgetPair outgoing_amount, BudgetState state) {}
    private Attributes attributes;
}
