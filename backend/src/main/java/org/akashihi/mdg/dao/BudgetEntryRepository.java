package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.BudgetEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BudgetEntryRepository extends JpaRepository<BudgetEntry, Long> { }
