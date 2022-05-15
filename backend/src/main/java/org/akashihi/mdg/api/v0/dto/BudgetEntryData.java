package org.akashihi.mdg.api.v0.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class BudgetEntryData {
    private Long id;
    private String type;
    public record Attributes(Long account_id, String account_name, String account_type, Boolean even_distribution, Boolean proration, BigDecimal expected_amount, BigDecimal actual_amount, BigDecimal change_amount) {}
    private Attributes attributes;
}
