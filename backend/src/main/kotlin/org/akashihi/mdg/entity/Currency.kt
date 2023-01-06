package org.akashihi.mdg.entity

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import org.hibernate.Hibernate
import javax.persistence.Entity
import javax.persistence.Id

@Entity
class Currency(
    var code: String,
    var name: String,
    var active: Boolean,
    @Id
    val id: Long? = null
) {
    @SuppressFBWarnings(value = ["BC_EQUALS_METHOD_SHOULD_WORK_FOR_ALL_OBJECTS"], justification = "Checked with Hibernate.getClass()")
    override fun equals(other: Any?): Boolean {
        if (this === other) {
            return true
        }
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) {
            return false
        }
        val currency = other as Currency
        return id != null && id == currency.id
    }

    override fun hashCode(): Int {
        return javaClass.hashCode()
    }
}
