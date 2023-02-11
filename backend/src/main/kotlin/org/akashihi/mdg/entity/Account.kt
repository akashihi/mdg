package org.akashihi.mdg.entity

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import org.akashihi.mdg.dao.AccountTypeConverter
import org.hibernate.annotations.Formula
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
    @field:JsonInclude(JsonInclude.Include.NON_NULL)
    var currency: Currency? = null,

    @Formula("currency_id")
    @JsonProperty("currency_id")
    var currencyId: Long? = null,

    @ManyToOne
    @JoinColumn(name = "category_id")
    @field:JsonInclude(JsonInclude.Include.NON_NULL)
    var category: Category? = null,

    @Formula("category_id")
    @JsonProperty("category_id")
    @field:JsonInclude(JsonInclude.Include.NON_NULL)
    var categoryId: Long? = null,

    @Formula("coalesce((select ab.balance from account_balance as ab where ab.account_id=id), 0)")
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
