package org.akashihi.mdg.dao

import org.akashihi.mdg.entity.Transaction
import org.springframework.data.jpa.domain.Specification
import java.util.stream.Stream
import javax.persistence.EntityManager

class TransactionRepositoryCustomImpl(private val em: EntityManager) : TransactionRepositoryCustom {
    override fun streamByAccount(spec: Specification<Transaction>): Stream<Transaction> {
        val cb = em.criteriaBuilder
        val query = cb.createQuery(Transaction::class.java)
        val root = query.from(Transaction::class.java)
        query.where(spec.toPredicate(root, query, cb))
        return em.createQuery(query).resultStream
    }
}