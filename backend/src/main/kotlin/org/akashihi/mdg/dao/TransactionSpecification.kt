package org.akashihi.mdg.dao

import org.akashihi.mdg.entity.Account
import org.akashihi.mdg.entity.Transaction
import org.akashihi.mdg.entity.TxSearchTerm
import org.akashihi.mdg.service.SearchCriteria
import org.springframework.data.jpa.domain.Specification
import java.time.LocalDateTime
import java.util.*
import javax.persistence.criteria.CriteriaBuilder
import javax.persistence.criteria.CriteriaQuery
import javax.persistence.criteria.Predicate
import javax.persistence.criteria.Root

object TransactionSpecification {
    fun transactionsForAccount(account: Account): Specification<Transaction> {
        return Specification { root: Root<Transaction>, _: CriteriaQuery<*>?, criteriaBuilder: CriteriaBuilder -> criteriaBuilder.equal(root.join<Any, Any>("operations").get<String>("account"), account) }
    }

    fun filteredTransactions(notEarlier: LocalDateTime?, notLater: LocalDateTime?, account: Account?): Specification<Transaction> {
        return Specification { root: Root<Transaction>, _: CriteriaQuery<*>?, criteriaBuilder: CriteriaBuilder ->
            val predicates: MutableCollection<Predicate> = ArrayList()
            notEarlier?.also { predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("ts"), notEarlier)) }
            notLater?.also { predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("ts"), notLater)) }
            account?.also { predicates.add(root.join<Any, Any>("operations").get<String>("account").get<String>("id").`in`(account.id)) }
            criteriaBuilder.and(*predicates.toTypedArray())
        }
    }

    fun filteredTransactions(search: SearchCriteria, filter: Map<String, String>, pointer: Pair<Long, LocalDateTime>?, ascending: Boolean = false): Specification<Transaction> {
        return Specification { root: Root<Transaction>, query: CriteriaQuery<*>?, criteriaBuilder: CriteriaBuilder ->
            val predicates: MutableCollection<Predicate> = ArrayList()
            // Every comment word needs one of its terms linked to the transaction
            search.words.forEach { termIds ->
                val sub = query!!.subquery(Long::class.java)
                val link = sub.from(TxSearchTerm::class.java)
                sub.select(link.get("txId")).where(criteriaBuilder.equal(link.get<Long>("txId"), root.get<Long>("id")), link.get<Long>("termId").`in`(termIds))
                predicates.add(criteriaBuilder.exists(sub))
            }
            // A transaction needs to carry any of the requested tags
            search.tagIds?.also { tagIds ->
                val sub = query!!.subquery(Long::class.java)
                val tags = sub.correlate(root).join<Any, Any>("tags")
                sub.select(tags.get("id")).where(tags.get<Long>("id").`in`(tagIds))
                predicates.add(criteriaBuilder.exists(sub))
            }
            if (filter.containsKey("notEarlier")) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("ts"), LocalDateTime.parse(filter["notEarlier"])))
            }
            if (filter.containsKey("notLater")) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("ts"), LocalDateTime.parse(filter["notLater"])))
            }
            if (filter.containsKey("account_id")) {
                val accountsString = filter["account_id"]!!.replace("[", "").replace("]", "")
                val accounts = Arrays.stream(accountsString.split(",".toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()).map { s: String -> s.toLong() }.toList()
                predicates.add(root.join<Any, Any>("operations").get<String>("account").get<String>("id").`in`(accounts))
            }
            pointer?.also { (pointerId, pointerTs) ->
                // Keyset predicate mirroring the sort: ts DESC, id DESC or ts ASC, id DESC
                val tsAfter = if (ascending) criteriaBuilder.greaterThan(root.get("ts"), pointerTs) else criteriaBuilder.lessThan(root.get("ts"), pointerTs)
                predicates.add(criteriaBuilder.or(tsAfter, criteriaBuilder.and(criteriaBuilder.equal(root.get<LocalDateTime>("ts"), pointerTs), criteriaBuilder.lessThan(root.get("id"), pointerId))))
            }
            criteriaBuilder.and(*predicates.toTypedArray())
        }
    }
}
