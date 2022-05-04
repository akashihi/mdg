package org.akashihi.mdg.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "budgetentry")
public class BudgetEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="budget_id", nullable = false)
    private Budget budget;
    @JsonProperty("account_id")
    @Transient
    private Long accountId;
    @ManyToOne
    @JoinColumn(name="account_id", nullable = false)
    private Account account;
    @JsonProperty("category_id")
    @Transient
    private Long categoryId;
    @Transient
    private Category category;
    @JsonProperty("even_distribution")
    private Boolean evenDistribution;
    private Boolean proration;
    @JsonProperty("expected_amount")
    private BigDecimal expectedAmount;
    @JsonProperty("actual_amount")
    @Transient
    private BigDecimal actualAmount;
    @JsonProperty("allowed_spendings")
    @Transient
    private BigDecimal allowedSpendings;
    @JsonProperty("spending_percent")
    @Transient
    private BigDecimal spendingPercent;
}
