package org.akashihi.mdg.dao;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.entity.Transaction;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.stream.Stream;

@RequiredArgsConstructor
public class TransactionRepositoryCustomImpl implements TransactionRepositoryCustom {
    private final EntityManager em;

    @Override
    public Stream<Transaction> streamByAccount(Specification<Transaction> spec) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Transaction> query = cb.createQuery(Transaction.class);
        Root<Transaction> root = query.from(Transaction.class);
        query.where(spec.toPredicate(root, query, cb));

        return em.createQuery(query).getResultStream();
    }
}
