package org.akashihi.mdg.entity

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import java.math.BigDecimal
import java.time.LocalDate
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Transient

data class BudgetPair(val actual: BigDecimal, val expected: BigDecimal)
data class BudgetState(val income: BudgetPair, val expense: BudgetPair, val allowed: BudgetPair)

@Entity
class Budget(
    @JsonProperty("term_beginning")
    @Column(name = "term_beginning")
    var beginning: LocalDate,

    @JsonProperty("term_end")
    @Column(name = "term_end")
    var end: LocalDate,

    @Transient
    @JsonProperty("incoming_amount")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    var incomingAmount: BigDecimal? = null,

    @Transient
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("outgoing_amount")
    var outgoingAmount: BudgetPair? = null,

    @Transient
    @JsonInclude(JsonInclude.Include.NON_NULL)
    var state: BudgetState? = null,

    @Id
    var id: Long? = null

)
