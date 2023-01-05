package org.akashihi.mdg.dao

import org.akashihi.mdg.entity.Budget
import org.akashihi.mdg.entity.BudgetEntry
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface BudgetEntryRepository : JpaRepository<BudgetEntry, Long> {
    fun findByBudget(b: Budget): Collection<BudgetEntry>
}