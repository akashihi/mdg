package org.akashihi.mdg.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.akashihi.mdg.api.v1.RestException;
import org.akashihi.mdg.dao.BudgetEntryRepository;
import org.akashihi.mdg.dao.BudgetRepository;
import org.akashihi.mdg.entity.Budget;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BudgetService {
    private final BudgetRepository budgetRepository;
    private final BudgetEntryRepository budgetEntryRepository;

    protected Boolean validateBudget(Budget budget) {
        if (budget.getBeginning().isAfter(budget.getEnd())) {
            throw new RestException("BUDGET_INVALID_TERM", 412, "/budgets");
        }
        if (ChronoUnit.DAYS.between(budget.getBeginning(), budget.getEnd())<1) {
            throw new RestException("BUDGET_SHORT_RANGE", 412, "/budgets");
        }
        if (budgetRepository.existsByEndGreaterThanEqualAndBeginningLessThanEqual(budget.getBeginning(), budget.getEnd())) {
            throw new RestException("BUDGET_OVERLAPPING", 412, "/budgets");
        }

        return true;
    }

    public Budget create(Budget budget) {
        validateBudget(budget);
        String id = budget.getBeginning().format(DateTimeFormatter.BASIC_ISO_DATE);
        budget.setId(Long.valueOf(id));
        budgetRepository.save(budget);
        log.info("Created budget {}", budget);
        return budget;
    }

    @Transactional
    public Collection<Budget> list() {
        return budgetRepository.findAll(Sort.by("beginning").descending());
    }

    @Transactional
    public Optional<Budget> get(Long id) {
        return budgetRepository.findFirstByIdLessThanEqualOrderByIdDesc(id);
    }

    @Transactional
    public Optional<Budget> update(Long id, Budget newBudget) {
        validateBudget(newBudget);

        var budgetValue = budgetRepository.findById(id);
        if (budgetValue.isEmpty()) {
            return budgetValue;
        }
        var budget = budgetValue.get();
        budget.setBeginning(newBudget.getBeginning());
        budget.setEnd(newBudget.getEnd());

        budgetRepository.save(budget);
        return Optional.of(budget);
    }

    @Transactional
    public void delete(Long id) {
        budgetRepository.deleteById(id);
    }
}
