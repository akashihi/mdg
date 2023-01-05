package org.akashihi.mdg.dao

import org.akashihi.mdg.entity.Budget
import org.springframework.data.jpa.domain.Specification
import javax.persistence.criteria.CriteriaBuilder
import javax.persistence.criteria.CriteriaQuery
import javax.persistence.criteria.Root

object BudgetSpecification {
    fun followingBudgets(pointer: Long): Specification<Budget> = Specification { root: Root<Budget>, _: CriteriaQuery<*>?, criteriaBuilder: CriteriaBuilder -> criteriaBuilder.lessThan(root.get("id"), pointer) }
}