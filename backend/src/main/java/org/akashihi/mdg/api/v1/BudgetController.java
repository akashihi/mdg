package org.akashihi.mdg.api.v1;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.util.CursorHelper;
import org.akashihi.mdg.api.v1.dto.BudgetCursor;
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
import org.akashihi.mdg.service.RateService;
import org.akashihi.mdg.service.SettingService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


import java.math.BigDecimal;
import java.util.Collection;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;

@RestController
@RequiredArgsConstructor
public class BudgetController {
    private final BudgetService budgetService;
    private final CategoryService categoryService;
    private final RateService rateService;
    private final SettingService settingService;
    private final CursorHelper cursorHelper;

    protected static BigDecimal getCategoryTotals(Function<BudgetEntryTreeEntry,BigDecimal> f, Collection<BudgetEntryTreeEntry> entries) {
        return entries.stream().map(f).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    protected BigDecimal getEntryTotals(Function<BudgetEntry,BigDecimal> f, Collection<BudgetEntry> entries) {
        return entries.stream().map(e -> {
            var amount = f.apply(e);
            if (!settingService.getCurrentCurrencyPrimary().map(c -> c.equals(e.getAccount().getCurrency())).orElse(true)) {
                var rate = rateService.getCurrentRateForPair(e.getAccount().getCurrency(), settingService.getCurrentCurrencyPrimary().get());
                amount = amount.multiply(rate.getRate());
            }
            return amount;
        }).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    protected BudgetEntryTreeEntry convertTopCategory(AccountType accountType, Collection<Category> categories, Collection<BudgetEntry> entries, Optional<Collection<String>> embed) {
        var enrichedEntries = entries.stream().peek(e -> {e.getAccount().setBalance(BigDecimal.ZERO); e.getAccount().setPrimaryBalance(BigDecimal.ZERO);}).toList();

        var topEntries = enrichedEntries.stream().filter(e -> e.getAccount().getAccountType().equals(accountType))
                .filter(e -> Objects.isNull(e.getAccount().getCategory()))
                .map(Embedding.embedBudgetEntryObject(embed))
                .toList();
        var topCategories = categories.stream().filter(a -> a.getAccountType().equals(accountType)).map(c -> convertCategory(c, enrichedEntries, embed)).filter(Optional::isPresent).map(Optional::get).toList();
        var actualSpendingsCategories = getCategoryTotals(BudgetEntryTreeEntry::actualAmount, topCategories);
        var expectedSpendingsCategories = getCategoryTotals(BudgetEntryTreeEntry::expectedAmount, topCategories);
        var allowedSpendingsCategories = getCategoryTotals(BudgetEntryTreeEntry::allowedSpendings, topCategories);
        var percent = BudgetService.getSpendingPercent(actualSpendingsCategories, expectedSpendingsCategories);
        return new BudgetEntryTreeEntry(null, null, actualSpendingsCategories, expectedSpendingsCategories, percent, allowedSpendingsCategories, topEntries, topCategories);
    }

    protected Optional<BudgetEntryTreeEntry> convertCategory(Category category, Collection<BudgetEntry> entries, Optional<Collection<String>> embed) {
        var categoryEntries = entries.stream().filter(e -> e.getAccount().getCategory() != null).filter(e -> e.getAccount().getCategory().equals(category)).map(Embedding.embedBudgetEntryObject(embed)).toList();
        var subCategories = category.getChildren().stream().map(c -> convertCategory(c, entries, embed)).filter(Optional::isPresent).map(Optional::get).toList();

        if (categoryEntries.isEmpty() && subCategories.isEmpty()) {
            return Optional.empty();
        }
        var actualSpendings = getEntryTotals(BudgetEntry::getActualAmount, categoryEntries).add(getCategoryTotals(BudgetEntryTreeEntry::actualAmount, subCategories));
        var expectedSpendings = getEntryTotals(BudgetEntry::getExpectedAmount, categoryEntries).add(getCategoryTotals(BudgetEntryTreeEntry::expectedAmount, subCategories));
        var allowedSpendings = getEntryTotals(BudgetEntry::getAllowedSpendings, categoryEntries).add(getCategoryTotals(BudgetEntryTreeEntry::allowedSpendings, subCategories));

        var percent = BudgetService.getSpendingPercent(actualSpendings, expectedSpendings);
        return Optional.of(new BudgetEntryTreeEntry(category.getId(), category.getName(), actualSpendings, expectedSpendings, allowedSpendings, percent, categoryEntries, subCategories));
    }

    @PostMapping(value = "/budgets", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.CREATED)
    Budget create(@RequestBody Budget budget) {
        return budgetService.create(budget);
    }

    @GetMapping(value = "/budgets", produces = "application/vnd.mdg+json;version=1")
    Budgets list(@RequestParam("limit") Optional<Integer> limit, @RequestParam("cursor") Optional<String> cursor) {
        BudgetCursor budgetCursor = cursor.flatMap(o -> cursorHelper.cursorFromString(o, BudgetCursor.class)).orElse(new BudgetCursor(limit.orElse(null), null));
        var budgets = budgetService.list(budgetCursor.limit(), budgetCursor.pointer());

        String self = cursorHelper.cursorToString(budgetCursor).orElse("");
        String first = "";
        String next = "";
        if (limit.isPresent() || cursor.isPresent()) { //In both cases we are in paging mode, either for the first page or for the subsequent pages
            var firstCursor = new BudgetCursor(budgetCursor.limit(), 0L);
            first = cursorHelper.cursorToString(firstCursor).orElse("");
            if (budgets.items().isEmpty() || budgets.left() == 0 ) {
                next = ""; //We may have no items at all or no items left, so no need to find next cursor
            } else {
                var nextCursor = new BudgetCursor(budgetCursor.limit(), budgets.items().get(budgets.items().size()-1).getId());
                next = cursorHelper.cursorToString(nextCursor).orElse("");
            }
        }
        return new Budgets(budgets.items(), self, first, next, budgets.left());
    }

    @GetMapping(value = "/budgets/{id}", produces = "application/vnd.mdg+json;version=1")
    Budget get(@PathVariable("id") Long id) {
        return budgetService.get(id).orElseThrow(() -> new MdgException("BUDGET_NOT_FOUND"));
    }

    @PutMapping(value = "/budgets/{id}", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.ACCEPTED)
    Budget update(@PathVariable("id") Long id, @RequestBody Budget budget) {
        return budgetService.update(id, budget).orElseThrow(() -> new MdgException("BUDGET_NOT_FOUND"));
    }

    @DeleteMapping("/budgets/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable("id") Long id) {
        budgetService.delete(id);
    }

    @GetMapping(value = "/budgets/{budgetId}/entries", produces = "application/vnd.mdg+json;version=1")
    BudgetEntries listEntries(@PathVariable("budgetId") Long budgetId, @RequestParam("embed") Optional<Collection<String>> embed) {
        return new BudgetEntries(budgetService.listEntries(budgetId).stream().map(Embedding.embedBudgetEntryObject(embed)).toList());
    }

    @GetMapping(value = "/budgets/{budgetId}/entries/tree", produces = "application/vnd.mdg+json;version=1")
    BudgetEntryTree tree(@PathVariable("budgetId") Long budgetId, @RequestParam("embed") Optional<Collection<String>> embed, @RequestParam("filter") Optional<String> filter) {
        budgetService.get(budgetId).orElseThrow(() -> new MdgException("BUDGET_NOT_FOUND"));
        var categories = categoryService.list();
        var entries = budgetService.listEntries(budgetId);
        var leaveEmtpy = filter.map("all"::equalsIgnoreCase).orElse(false);
        if (!leaveEmtpy) {
            entries = entries.stream().filter(e -> !(e.getActualAmount().compareTo(BigDecimal.ZERO)==0 && e.getExpectedAmount().compareTo(BigDecimal.ZERO)==0)).toList();
        }

        var expenseEntry = convertTopCategory(AccountType.EXPENSE, categories, entries, embed);
        var incomeEntry = convertTopCategory(AccountType.INCOME, categories, entries, embed);
        return new BudgetEntryTree(expenseEntry ,incomeEntry);
    }

    @GetMapping(value = "/budgets/{budgetId}/entries/{entryId}", produces = "application/vnd.mdg+json;version=1")
    BudgetEntry getEntry(@PathVariable("budgetId") Long budgetId, @PathVariable("entryId") Long entryId, @RequestParam("embed") Optional<Collection<String>> embed) {
        return budgetService.getBudgetEntry(entryId).map(Embedding.embedBudgetEntryObject(embed)).orElseThrow(() -> new MdgException("BUDGETENTRY_NOT_FOUND"));
    }

    @PutMapping(value = "/budgets/{budgetId}/entries/{entryId}", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.ACCEPTED)
    BudgetEntry updateEntry(@PathVariable("budgetId") Long budgetId, @PathVariable("entryId") Long entryId, @RequestBody BudgetEntry entry) {
        return budgetService.updateBudgetEntry(entryId, entry).map(Embedding.embedBudgetEntryObject(Optional.empty())).orElseThrow(() -> new MdgException("BUDGETENTRY_NOT_FOUND"));
    }
}
