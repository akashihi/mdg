package org.akashihi.mdg.entity

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import org.akashihi.mdg.dao.BudgetEntryModeConverter
import java.math.BigDecimal
import javax.persistence.Convert
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table
import javax.persistence.Transient

@Entity
@Table(name = "budgetentry")
class BudgetEntry (
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "budget_id", nullable = false)
    val budget: Budget,

    @JsonProperty("account_id")
    @Transient
    var accountId: Long,

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    var account: Account? = null,

    @JsonProperty("category_id")
    @Transient
    @JsonInclude(JsonInclude.Include.NON_NULL)
    var categoryId: Long? = null,

    @Transient
    @JsonInclude(JsonInclude.Include.NON_NULL)
    var category: Category? = null,

    @Convert(converter = BudgetEntryModeConverter::class)
    var distribution: BudgetEntryMode,

    @JsonProperty("expected_amount")
    var expectedAmount: BigDecimal,

    @JsonProperty("actual_amount")
    @Transient
    var actualAmount: BigDecimal,

    @JsonProperty("allowed_spendings")
    @Transient
    var allowedSpendings: BigDecimal,

    @JsonProperty("spending_percent")
    @Transient
    var spendingPercent: BigDecimal,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
) {
    constructor(other: BudgetEntry) : this(other.budget, other.accountId, other.account, other.categoryId, other.category, other.distribution, other.expectedAmount, other.actualAmount, other.allowedSpendings, other.spendingPercent, other.id)
}