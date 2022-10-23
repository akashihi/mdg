package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.Budget;
import org.springframework.data.jpa.domain.Specification;

public class BudgetSpecification {
    private BudgetSpecification() {}

    public static Specification<Budget> followingBudgets(Long pointer) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.lessThan(root.get("id"), pointer);
    }
}
