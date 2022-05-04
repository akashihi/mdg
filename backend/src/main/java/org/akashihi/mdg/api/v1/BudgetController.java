package org.akashihi.mdg.api.v1;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v1.dto.BudgetEntries;
import org.akashihi.mdg.api.v1.dto.Budgets;
import org.akashihi.mdg.api.v1.filtering.Embedding;
import org.akashihi.mdg.entity.Budget;
import org.akashihi.mdg.entity.BudgetEntry;
import org.akashihi.mdg.service.BudgetService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class BudgetController {
    private final BudgetService budgetService;

    @PostMapping(value = "/budgets", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.CREATED)
    Budget create(@RequestBody Budget budget) {
        return budgetService.create(budget);
    }

    @GetMapping(value = "/budgets", produces = "application/vnd.mdg+json;version=1")
    Budgets list() {
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
