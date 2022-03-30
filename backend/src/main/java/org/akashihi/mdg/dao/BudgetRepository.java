package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    Boolean existsByEndGreaterThanEqualAndBeginningLessThanEqual(LocalDate other_beginning, LocalDate other_end);
    Optional<Budget> findFirstByIdLessThanEqualOrderByIdDesc(Long id);
}
