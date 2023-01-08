package org.akashihi.mdg.dao

import org.akashihi.mdg.entity.Account
import org.akashihi.mdg.entity.AccountType.Companion.from
import org.springframework.data.jpa.domain.Specification
import javax.persistence.criteria.CriteriaBuilder
import javax.persistence.criteria.CriteriaQuery
import javax.persistence.criteria.Predicate
import javax.persistence.criteria.Root
import kotlin.Any
import kotlin.String

object AccountSpecification {
    fun filteredAccount(filter: Map<String, String>): Specification<Account> {
        return Specification { root: Root<Account>, _: CriteriaQuery<*>, criteriaBuilder: CriteriaBuilder ->
            val predicates: MutableCollection<Predicate> = ArrayList()
            filter["account_type"]?.also { predicates.add(criteriaBuilder.equal(root.get<Any>("accountType"), from(it.uppercase()))) }
            filter["currency_id"]?.also { predicates.add(criteriaBuilder.equal(root.get<Any>("currency.id"), it.toLong())) }
            filter["name"]?.also { predicates.add(criteriaBuilder.equal(root.get<Any>("name"), it)) }
            filter["hidden"]?.also { predicates.add(criteriaBuilder.equal(root.get<Any>("hidden"), it.toBoolean())) }
            criteriaBuilder.and(*predicates.toTypedArray())
        }
    }
}
