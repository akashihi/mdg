package org.akashihi.mdg.entity

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import org.akashihi.mdg.dao.BudgetEntryModeConverter
import org.hibernate.annotations.Formula
import java.math.BigDecimal
import java.time.LocalDate
import javax.persistence.Column
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
class BudgetEntry(
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "budget_id", nullable = false)
    val budget: Budget,

    @JsonProperty("account_id")
    @Formula("account_id")
    var accountId: Long,

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    @field:JsonInclude(JsonInclude.Include.NON_NULL)
    var account: Account? = null,

    @JsonProperty("category_id")
    @Formula("(select a.category_id from account as a where a.id=account_id)")
    @field:JsonInclude(JsonInclude.Include.NON_NULL)
    var categoryId: Long? = null,

    @Transient
    @field:JsonInclude(JsonInclude.Include.NON_NULL)
    var category: Category? = null,

    @Column(name = "dt")
    @field:JsonInclude(JsonInclude.Include.NON_NULL)
    var dt: LocalDate? = null,

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
    constructor(other: BudgetEntry) : this(other.budget, other.accountId, other.account, other.categoryId, other.category, other.dt, other.distribution, other.expectedAmount, other.actualAmount, other.allowedSpendings, other.spendingPercent, other.id)
}
