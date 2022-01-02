package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.Account;
import org.akashihi.mdg.entity.AccountType;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

public class AccountSpecification {
    public static Specification<Account> filteredAccount(Map<String, String> filter) {
        return (root, query, criteriaBuilder) -> {
            Collection<Predicate> predicates = new ArrayList<>();
            if (filter.containsKey("account_type")) {
                var at = AccountType.from(filter.get("account_type").toUpperCase());
                predicates.add(criteriaBuilder.equal(root.get("accountType"), at));
            }
            if (filter.containsKey("currency_id")) {
                predicates.add(criteriaBuilder.equal(root.get("currency.id"), Long.parseLong(filter.get("currency_id"))));
            }
            if (filter.containsKey("name")) {
                predicates.add(criteriaBuilder.equal(root.get("name"), filter.get("name")));
            }
            if (filter.containsKey("hidden")) {
                predicates.add(criteriaBuilder.equal(root.get("hidden"), Boolean.parseBoolean(filter.get("hidden"))));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
        };
    }
}
