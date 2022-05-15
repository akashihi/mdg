package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.Account;
import org.akashihi.mdg.entity.Transaction;
import org.akashihi.mdg.indexing.IndexingService;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.*;

public class TransactionSpecification {
    public static Specification<Transaction> transactionsForAccount(Account account) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.join("operations").<String>get("account"), account);
    }

    public static Specification<Transaction> filteredTransactions(LocalDateTime notEarlier, LocalDateTime notLater, Account account) {
        return (root, query, criteriaBuilder) -> {
            Collection<Predicate> predicates = new ArrayList<>();

            if (Objects.nonNull(notEarlier)) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("ts"), notEarlier));
            }
            if (Objects.nonNull(notLater)) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("ts"), notLater));
            }
            if (Objects.nonNull(account)) {
                predicates.add(root.join("operations").<String>get("account").<String>get("id").in(account.getId()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<Transaction> filteredTransactions(IndexingService indexingService, Map<String, String> filter, Long pointer) {
        return (root, query, criteriaBuilder) -> {
            Collection<Predicate> predicates = new ArrayList<>();

            Collection<Long> fulltextIds = new ArrayList<>();
            if (filter.containsKey("comment")) {
                fulltextIds.addAll(indexingService.lookupByComment(filter.get("comment")));
            }
            if (filter.containsKey("tag")) {
                fulltextIds.addAll(indexingService.lookupByTag(filter.get("tag")));
            }
            if (!fulltextIds.isEmpty()) {
                predicates.add(root.get("id").in(fulltextIds));
            } else {
                if (filter.containsKey("comment") || filter.containsKey("tag")) {
                    predicates.add(criteriaBuilder.equal(root.get("id"), -1)); //Prevent any results pickup
                }
            }

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
