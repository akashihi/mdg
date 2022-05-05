package org.akashihi.mdg.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.akashihi.mdg.api.v1.RestException;
import org.akashihi.mdg.dao.BudgetEntryRepository;
import org.akashihi.mdg.dao.BudgetRepository;
import org.akashihi.mdg.entity.Budget;
import org.akashihi.mdg.entity.BudgetEntry;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.Collections;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BudgetService {
    private final BudgetRepository budgetRepository;
    private final BudgetEntryRepository budgetEntryRepository;

    private final TransactionService transactionService;

    protected Boolean validateBudget(Budget budget) {
        if (budget.getBeginning().isAfter(budget.getEnd())) {
            throw new RestException("BUDGET_INVALID_TERM", 412, "/budgets");
        }
        if (ChronoUnit.DAYS.between(budget.getBeginning(), budget.getEnd()) < 1) {
            throw new RestException("BUDGET_SHORT_RANGE", 412, "/budgets");
        }
        if (budgetRepository.existsByEndGreaterThanEqualAndBeginningLessThanEqual(budget.getBeginning(), budget.getEnd())) {
            throw new RestException("BUDGET_OVERLAPPING", 412, "/budgets");
        }

        return true;
    }

    protected void applyActualAmount(BudgetEntry entry) {
        var from = entry.getBudget().getBeginning();
        var to = entry.getBudget().getEnd();

        // Find actual spendings
        entry.setActualAmount(transactionService.spendingOverPeriod(from.atTime(0, 0), to.atTime(23, 59), entry.getAccount()));
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

    public static void analyzeSpendings(BudgetEntry entry, LocalDate forDay) {
        var from = entry.getBudget().getBeginning();
        var to = entry.getBudget().getEnd();

        // Execution percent
        if (entry.getExpectedAmount().compareTo(BigDecimal.ZERO) == 0) {
            entry.setSpendingPercent(BigDecimal.valueOf(100L));
        } else {
            var value = entry.getActualAmount().setScale(2, RoundingMode.HALF_UP).divide(entry.getExpectedAmount(), RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100L)).setScale(0, RoundingMode.HALF_UP);
            if (value.compareTo(BigDecimal.valueOf(100L)) > 0) {
                value = BigDecimal.valueOf(100L); // Cap overspending to 100%
            }
            entry.setSpendingPercent(value);
        }

        //Proposed spendings
        if (forDay.isBefore(from.minusDays(1)) || forDay.isAfter(to)) {
            // We are out of that budget, no spendings are allowed
            entry.setAllowedSpendings(BigDecimal.ZERO);
        } else {
            var budgetLength = BigDecimal.valueOf(ChronoUnit.DAYS.between(from.minusDays(1), to)); //Including first day
            var daysLeft = BigDecimal.valueOf(ChronoUnit.DAYS.between(forDay.minusDays(1), to)); //Including today
            var daysPassed = BigDecimal.valueOf(ChronoUnit.DAYS.between(from.minusDays(1), forDay)); //Including first day and today

            if (Objects.nonNull(entry.getEvenDistribution()) && entry.getEvenDistribution()) {
                // Calculate for prorated by default
                BigDecimal allowed = ((entry.getExpectedAmount().divide(budgetLength, RoundingMode.HALF_DOWN)).multiply(daysPassed)).subtract(entry.getActualAmount());
                if ((Objects.isNull(entry.getProration()) || !entry.getProration()) || allowed.compareTo(BigDecimal.ZERO) < 0) {
                    // Recalculate for even
                    allowed = (entry.getExpectedAmount().subtract(entry.getActualAmount())).divide(daysLeft, RoundingMode.HALF_DOWN);
                }
                entry.setAllowedSpendings(allowed);
            } else {
                // Not evenly distributed, spend everything left
                var allowed = entry.getExpectedAmount().subtract(entry.getActualAmount());
                entry.setAllowedSpendings(allowed);
            }
            if (entry.getAllowedSpendings().compareTo(BigDecimal.ZERO) < 0) {
                //Nothing to spend
                entry.setAllowedSpendings(BigDecimal.ZERO);
            }
            entry.setAllowedSpendings(entry.getAllowedSpendings().setScale(0, RoundingMode.HALF_DOWN));
        }
    }

    @Transactional
    public Optional<BudgetEntry> getBudgetEntry(Long entryId) {
        var entryValue = budgetEntryRepository.findById(entryId);
        if (entryValue.isEmpty()) {
            return entryValue;
        }

        var entry = entryValue.get();

        this.applyActualAmount(entry);
        // Apply spendings analysis
        analyzeSpendings(entry, LocalDate.now());

        return Optional.of(entry);
    }

    @Transactional
    public Optional<BudgetEntry> updateBudgetEntry(Long entryId, BudgetEntry newEntry) {
        var entryValue = budgetEntryRepository.findById(entryId);
        if (entryValue.isEmpty()) {
            return entryValue;
        }

        var entry = entryValue.get();
        if (newEntry.getExpectedAmount().compareTo(BigDecimal.ZERO) >= 0) {
            entry.setExpectedAmount(newEntry.getExpectedAmount());
        } else {
            throw new RestException("BUDGETENTRY_IS_NEGATIVE", 422, "/budgets/%d/entry/%d".formatted(entry.getBudget().getId(), entryId));
        }
        entry.setEvenDistribution(newEntry.getEvenDistribution());
        if (newEntry.getEvenDistribution()) {
            entry.setProration(newEntry.getProration());
        } else {
            entry.setProration(false);
        }

        this.applyActualAmount(entry);
        analyzeSpendings(entry, LocalDate.now());

        budgetEntryRepository.save(entry);
        return Optional.of(entry);
    }

    @Transactional
    public Collection<BudgetEntry> listEntries(Long budgetId) {
        var budget = this.get(budgetId);
        if (budget.isEmpty()) {
            return Collections.emptyList();
        }

        var today = LocalDate.now();
        var entries = budgetEntryRepository.findByBudget(budget.get());
        entries.forEach(e -> {this.applyActualAmount(e); analyzeSpendings(e, today);});

        return entries;
    }

    @Transactional
    public void delete(Long id) {
        budgetRepository.deleteById(id);
    }
}
