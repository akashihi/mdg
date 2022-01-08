package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.Transaction;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Map;

public class TransactionSpecification {
    public static Specification<Transaction> filteredTransactions(Map<String, String> filter, Long pointer) {
        return (root, query, criteriaBuilder) -> {
            Collection<Predicate> predicates = new ArrayList<>();
            if (filter.containsKey("notEarlier")) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("ts"), LocalDateTime.parse(filter.get("notEarlier"))));
            }
            if (filter.containsKey("notLater")) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("ts"), LocalDateTime.parse(filter.get("notLater"))));
            }
            if (filter.containsKey("account_id")) {
                var accountsString = filter.get("account_id").replace("[", "").replace("]", "");
                var accounts = Arrays.stream(accountsString.split(",")).map(Long::parseLong).toList();

                predicates.add(root.join("operations").<String>get("account").<String>get("id").in(accounts));
            }
            if (pointer != null) {
                predicates.add(criteriaBuilder.lessThan(root.get("id"), pointer));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
