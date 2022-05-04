package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.Budget;
import org.akashihi.mdg.entity.BudgetEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface BudgetEntryRepository extends JpaRepository<BudgetEntry, Long> {
    Collection<BudgetEntry> findByBudget(Budget b);
}
