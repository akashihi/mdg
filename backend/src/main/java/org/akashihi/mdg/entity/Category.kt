package org.akashihi.mdg.entity

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import org.akashihi.mdg.dao.AccountTypeConverter
import javax.persistence.Convert
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.Transient

@Entity
class Category(
    @Convert(converter = AccountTypeConverter::class)
    @JsonProperty("account_type")
    val accountType: AccountType,
    var name: String,
    var priority: Int,

    @Transient
    @JsonProperty("parent_id")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    var parentId: Long? = null,

    @Transient
    var children: Collection<Category>,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null
)