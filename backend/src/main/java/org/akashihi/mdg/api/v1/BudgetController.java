package org.akashihi.mdg.api.v1;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v1.dto.BudgetEntries;
import org.akashihi.mdg.api.v1.dto.BudgetEntryTree;
import org.akashihi.mdg.api.v1.dto.BudgetEntryTreeEntry;
import org.akashihi.mdg.api.v1.dto.Budgets;
import org.akashihi.mdg.api.v1.filtering.Embedding;
import org.akashihi.mdg.entity.AccountType;
import org.akashihi.mdg.entity.Budget;
import org.akashihi.mdg.entity.BudgetEntry;
import org.akashihi.mdg.entity.Category;
import org.akashihi.mdg.service.BudgetService;
import org.akashihi.mdg.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class BudgetController {
    private final BudgetService budgetService;
    private final CategoryService categoryService;

    private record Subtotal(BudgetEntryTreeEntry entry, Boolean even, Boolean prorated, BigDecimal actual, BigDecimal expected) {}

    protected BudgetEntryTreeEntry convertTopCategory(AccountType accountType, Collection<Category> categories, Collection<BudgetEntry> entries, Optional<Collection<String>> embed, LocalDate from, LocalDate to, LocalDate forDay) {
        var topEntries = entries.stream().filter(e -> e.getAccount().getAccountType().equals(accountType))
                .filter(e -> Objects.isNull(e.getAccount().getCategory()))
                .map(Embedding.embedBudgetEntryObject(embed))
                .toList();
        var topCategories = categories.stream().filter(a -> a.getAccountType().equals(accountType)).map(c -> convertCategory(c, entries, embed, from, to, forDay)).filter(Optional::isPresent).map(Optional::get).toList();
        var prorated = topCategories.stream().allMatch(Subtotal::prorated);
        var even = topCategories.stream().allMatch(Subtotal::even);
        if (!even) {
            prorated = false; //Should happen automatically, but let's ensure it.
        }
        var actualSpendingsCategories = topCategories.stream().map(Subtotal::actual).reduce(BigDecimal.ZERO, BigDecimal::add);
        var expectedSpendingsCategories = topCategories.stream().map(Subtotal::expected).reduce(BigDecimal.ZERO, BigDecimal::add);
        var percent = BudgetService.getSpendingPercent(actualSpendingsCategories, expectedSpendingsCategories);
        var allowedSpendings = BudgetService.getAllowedSpendings(actualSpendingsCategories, expectedSpendingsCategories, from, to, forDay, even, prorated);
        return new BudgetEntryTreeEntry(null, null, actualSpendingsCategories, expectedSpendingsCategories, percent, allowedSpendings, topEntries, topCategories.stream().map(Subtotal::entry).toList());
    }

    protected Optional<Subtotal> convertCategory(Category category, Collection<BudgetEntry> entries, Optional<Collection<String>> embed, LocalDate from, LocalDate to, LocalDate forDay) {
        var categoryEntries = entries.stream().filter(e -> e.getAccount().getCategory() != null).filter(e -> e.getAccount().getCategory().equals(category)).map(Embedding.embedBudgetEntryObject(embed)).toList();
        var subCategories = category.getChildren().stream().map(c -> convertCategory(c, entries, embed, from, to, forDay)).filter(Optional::isPresent).map(Optional::get).toList();
        var prorated = subCategories.stream().allMatch(Subtotal::prorated) && categoryEntries.stream().allMatch(BudgetEntry::getProration);
        var even = subCategories.stream().allMatch(Subtotal::even) && categoryEntries.stream().allMatch(BudgetEntry::getEvenDistribution);
        if (!even) {
            prorated = false; //Should happen automatically, but let's ensure it.
        }
        var actualSpendingsEntries = categoryEntries.stream().map(BudgetEntry::getActualAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        var actualSpendingsCategories = subCategories.stream().map(Subtotal::actual).reduce(BigDecimal.ZERO, BigDecimal::add);
        var actualSpendings = actualSpendingsEntries.add(actualSpendingsCategories);

        var expectedSpendingsEntries = categoryEntries.stream().map(BudgetEntry::getExpectedAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        var expectedSpendingsCategories = subCategories.stream().map(Subtotal::expected).reduce(BigDecimal.ZERO, BigDecimal::add);
        var expectedSpendings = expectedSpendingsEntries.add(expectedSpendingsCategories);

        if (categoryEntries.isEmpty() && subCategories.isEmpty()) {
            return Optional.empty();
        } else {
            var percent = BudgetService.getSpendingPercent(actualSpendings, expectedSpendings);
            var allowedSpendings = BudgetService.getAllowedSpendings(actualSpendings, expectedSpendings, from, to, forDay, even, prorated);
            var upperEntry = new BudgetEntryTreeEntry(category.getId(), category.getName(), actualSpendings, expectedSpendings, percent, allowedSpendings, categoryEntries, subCategories.stream().map(Subtotal::entry).toList());
            return Optional.of(new Subtotal(upperEntry, even, prorated, actualSpendings, expectedSpendings));
        }
    }

    @PostMapping(value = "/budgets", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.CREATED)
    Budget create(@RequestBody Budget budget) {
        return budgetService.create(budget);
    }

    @GetMapping(value = "/budgets", produces = "application/vnd.mdg+json;version=1")
    Budgets list() { // TODO Implement paging
        return new Budgets(budgetService.list());
    }

    @GetMapping(value = "/budgets/{id}", produces = "application/vnd.mdg+json;version=1")
    Budget get(@PathVariable("id") Long id) {
        return budgetService.get(id).orElseThrow(() -> new RestException("BUDGET_NOT_FOUND", 404, "/budgets/%d".formatted(id)));
    }

    @PutMapping(value = "/budgets/{id}", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.ACCEPTED)
    Budget update(@PathVariable("id") Long id, @RequestBody Budget budget) {
        return budgetService.update(id, budget).orElseThrow(() -> new RestException("BUDGET_NOT_FOUND", 404, "/budgets/%d".formatted(id)));
    }

    @DeleteMapping(value = "/budgets/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable("id") Long id) {
        budgetService.delete(id);
    }

    @GetMapping(value = "/budgets/{budgetId}/entries", produces = "application/vnd.mdg+json;version=1")
    BudgetEntries listEntries(@PathVariable("budgetId") Long budgetId) {
        return new BudgetEntries(budgetService.listEntries(budgetId));
    }

    @GetMapping(value = "/budgets/{budgetId}/entries/tree", produces = "application/vnd.mdg+json;version=1")
    BudgetEntryTree tree(@PathVariable("budgetId") Long budgetId, @RequestParam("embed") Optional<Collection<String>> embed, @RequestParam("filter") Optional<String> filter) {
        var budget = budgetService.get(budgetId).orElseThrow(() -> new RestException("BUDGET_NOT_FOUND", 404, "/budgets/{%d}/entries/tree".formatted(budgetId)));
        var categories = categoryService.list();
        var entries = budgetService.listEntries(budgetId);
        var leaveEmtpy = filter.map(f -> f.equalsIgnoreCase("all")).orElse(false);
        if (!leaveEmtpy) {
            entries = entries.stream().filter(e -> !(e.getActualAmount().compareTo(BigDecimal.ZERO)==0 && e.getExpectedAmount().compareTo(BigDecimal.ZERO)==0)).toList();
        }

        var expenseEntry = convertTopCategory(AccountType.EXPENSE, categories, entries, embed, budget.getBeginning(), budget.getEnd(), LocalDate.now());
        var incomeEntry = convertTopCategory(AccountType.INCOME, categories, entries, embed, budget.getBeginning(), budget.getEnd(), LocalDate.now());
        return new BudgetEntryTree(expenseEntry ,incomeEntry);
    }

    @GetMapping(value = "/budgets/{budgetId}/entries/{entryId}", produces = "application/vnd.mdg+json;version=1")
    BudgetEntry getEntry(@PathVariable("budgetId") Long budgetId, @PathVariable("entryId") Long entryId, @RequestParam("embed") Optional<Collection<String>> embed) {
        return budgetService.getBudgetEntry(entryId).map(Embedding.embedBudgetEntryObject(embed)).orElseThrow(() -> new RestException("BUDGETENTRY_NOT_FOUND", 404, "/budgets/%d/entries/%d".formatted(budgetId, entryId)));
    }

    @PutMapping(value = "/budgets/{budgetId}/entries/{entryId}", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.ACCEPTED)
    BudgetEntry updateEntry(@PathVariable("budgetId") Long budgetId, @PathVariable("entryId") Long entryId, @RequestBody BudgetEntry entry) {
        return budgetService.updateBudgetEntry(entryId, entry).map(Embedding.embedBudgetEntryObject(Optional.empty())).orElseThrow(() -> new RestException("BUDGETENTRY_NOT_FOUND", 404, "/budgets/%d/entries/%d".formatted(budgetId, entryId)));
    }
}
