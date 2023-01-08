package org.akashihi.mdg.entity

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonInclude
import org.hibernate.Hibernate
import java.math.BigDecimal
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Transient

@Entity
class Operation(
    @ManyToOne
    @JoinColumn(name = "tx_id", nullable = false)
    @JsonIgnore
    var transaction: Transaction,
    var rate: BigDecimal?,
    var amount: BigDecimal,

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    @field:JsonInclude(JsonInclude.Include.NON_NULL)
    var account: Account? = null,

    @Transient
    var account_id: Long? = null,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    val id: Long? = null
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) {
            return true
        }
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) {
            return false
        }
        val operation = other as Operation
        return id != null && id == operation.id
    }

    override fun hashCode(): Int {
        return id?.hashCode() ?: 0
    }
}
