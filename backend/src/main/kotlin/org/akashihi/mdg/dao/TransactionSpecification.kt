package org.akashihi.mdg.dao

import org.akashihi.mdg.entity.Account
import org.akashihi.mdg.entity.Transaction
import org.akashihi.mdg.indexing.IndexingService
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

    fun filteredTransactions(indexingService: IndexingService, filter: Map<String, String>, pointer: Pair<Long, LocalDateTime>?, ascending: Boolean = false): Specification<Transaction> {
        return Specification { root: Root<Transaction>, _: CriteriaQuery<*>?, criteriaBuilder: CriteriaBuilder ->
            val predicates: MutableCollection<Predicate> = ArrayList()
            val fulltextIds: MutableCollection<Long?> = ArrayList()
            filter["comment"]?.also { fulltextIds.addAll(indexingService.lookupByComment(it)) }
            filter["tag"]?.also { fulltextIds.addAll(indexingService.lookupByTag(it)) }
            if (!fulltextIds.isEmpty()) {
                predicates.add(root.get<Any>("id").`in`(fulltextIds))
            } else {
                if (filter.containsKey("comment") || filter.containsKey("tag")) {
                    predicates.add(criteriaBuilder.equal(root.get<Any>("id"), -1)) // Prevent any results pickup
                }
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
