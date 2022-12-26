package org.akashihi.mdg.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Budget {

    public record BudgetPair(BigDecimal actual, BigDecimal expected) {}
    public record BudgetState(BudgetPair income, BudgetPair expense, BudgetPair allowed) {}

    @Id
    public Long id;

    @Column(name = "term_beginning")
    @JsonProperty("term_beginning")
    private LocalDate beginning;

    @Column(name = "term_end")
    @JsonProperty("term_end")
    private LocalDate end;

    @Transient
    @JsonProperty("incoming_amount")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private BigDecimal incomingAmount;

    @Transient
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("outgoing_amount")
    private BudgetPair outgoingAmount;

    @Transient
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private BudgetState state;

    public Budget(Long id, LocalDate beginning, LocalDate end) {
        this.id = id;
        this.beginning = beginning;
        this.end = end;
    }
}
