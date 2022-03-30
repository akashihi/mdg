package org.akashihi.mdg.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class BudgetEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name="budget_id", nullable = false)
    private Budget budget;
    @ManyToOne
    @JoinColumn(name="account_id", nullable = false)
    private Account account;
    @JsonProperty("even_distribution")
    private Boolean evenDistribution;
    private Boolean proration;
    @JsonProperty("expected_amount")
    private BigDecimal expectedAmount;
}
