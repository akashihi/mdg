package org.akashihi.mdg.entity

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import org.akashihi.mdg.dao.AccountTypeConverter
import java.math.BigDecimal
import javax.persistence.Convert
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Transient

@Entity
class Account(
    @Convert(converter = AccountTypeConverter::class)
    @JsonProperty("account_type")
    val accountType: AccountType,

    var name: String,

    @ManyToOne
    @JoinColumn(name = "currency_id", nullable = false)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    var currency: Currency? = null,

    @Transient
    @JsonProperty("currency_id")
    var currencyId: Long? = null,

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    var category: Category? = null,

    @Transient
    @JsonProperty("category_id")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    var categoryId: Long? = null,

    @Transient
    var balance: BigDecimal,

    @Transient
    @JsonProperty("primary_balance")
    var primaryBalance: BigDecimal,
    var hidden: Boolean? = null,
    var operational: Boolean? = null,
    var favorite: Boolean? = null,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
)