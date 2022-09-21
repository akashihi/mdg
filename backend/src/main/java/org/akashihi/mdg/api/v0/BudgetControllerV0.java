package org.akashihi.mdg.api.v0;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v0.dto.BudgetData;
import org.akashihi.mdg.api.v0.dto.BudgetEntryData;
import org.akashihi.mdg.api.v0.dto.DataPlural;
import org.akashihi.mdg.api.v0.dto.DataSingular;
import org.akashihi.mdg.api.v0.dto.RequestException;
import org.akashihi.mdg.api.v1.RestException;
import org.akashihi.mdg.entity.Budget;
import org.akashihi.mdg.entity.BudgetEntry;
import org.akashihi.mdg.entity.BudgetEntryMode;
import org.akashihi.mdg.service.BudgetService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequiredArgsConstructor
public class BudgetControllerV0 {
    private final BudgetService budgetService;

    private Budget fromDto(BudgetData data) {
        return new Budget(data.getId(), LocalDate.parse(data.getAttributes().term_beginning(), DateTimeFormatter.ISO_LOCAL_DATE), LocalDate.parse(data.getAttributes().term_end(), DateTimeFormatter.ISO_LOCAL_DATE));
    }

    private BudgetData.Attributes toFullDto(Budget budget) {
        var outgoing = new BudgetData.BudgetPair(budget.getOutgoingAmount().actual(),budget.getOutgoingAmount().actual());
        var income = new BudgetData.BudgetPair(budget.getState().income().actual(), budget.getState().income().expected());
        var expense = new BudgetData.BudgetPair(budget.getState().expense().actual(), budget.getState().expense().expected());
        var change = new BudgetData.BudgetPair(budget.getState().allowed().actual(), budget.getState().allowed().expected());
        var state = new BudgetData.BudgetState(income, expense, change);
        return new BudgetData.Attributes(budget.getBeginning().format(DateTimeFormatter.ISO_LOCAL_DATE), budget.getEnd().format(DateTimeFormatter.ISO_LOCAL_DATE), budget.getIncomingAmount(), outgoing, state);
    }

    private BudgetData.Attributes toDto(Budget budget) {
        return new BudgetData.Attributes(budget.getBeginning().format(DateTimeFormatter.ISO_LOCAL_DATE), budget.getEnd().format(DateTimeFormatter.ISO_LOCAL_DATE), null, null, null);
    }

    private BudgetEntry fromDto(BudgetEntryData data) {
        var entry = new BudgetEntry();
        entry.setExpectedAmount(data.getAttributes().expected_amount());
        entry.setDistribution(BudgetEntryMode.from(data.getAttributes().even_distribution(), data.getAttributes().proration()));
        return entry;
    }

    private BudgetEntryData.Attributes toDto(BudgetEntry entry) {
        return new BudgetEntryData.Attributes(entry.getAccount().getId(), entry.getAccount().getName(), entry.getAccount().getAccountType().toDbValue(), entry.getDistribution()!=BudgetEntryMode.SINGLE, entry.getDistribution() == BudgetEntryMode.PRORATED, entry.getExpectedAmount(), entry.getActualAmount(), entry.getAllowedSpendings());
    }

    @GetMapping(value = "/api/budget", produces = "application/vnd.mdg+json")
    DataPlural<BudgetData> list() {
        return new DataPlural<>(budgetService.list().stream().map(b -> new BudgetData(b.getId(), "budget", toDto(b))).toList());
    }

    @GetMapping(value = "/api/budget/{id}", produces = "application/vnd.mdg+json")
    DataSingular<BudgetData> get(@PathVariable("id") Long id) {
        var budget =  budgetService.get(id).orElseThrow(() -> new RestException("BUDGET_NOT_FOUND", 404, "/budgets/%d".formatted(id)));
        return new DataSingular<>(new BudgetData(budget.getId(), "budget", toFullDto(budget)));
    }

    @PostMapping(value = "/api/budget", consumes = {"application/vnd.mdg+json", "application/json"}, produces = "application/vnd.mdg+json")
    @ResponseStatus(HttpStatus.CREATED)
    DataSingular<BudgetData> addBudget(@RequestBody DataSingular<BudgetData> data) {
        try {
            var budget= budgetService.create(fromDto(data.data()));
            return new DataSingular<>(new BudgetData(budget.getId(), "budget", toDto(budget)));
        } catch (RestException ex) {
            throw new RequestException(ex.getStatus(), ex.getTitle(), ex);
        }
    }

    @PutMapping(value = "/api/budget/{id}", consumes = {"application/vnd.mdg+json", "application/json"}, produces = "application/vnd.mdg+json")
    @ResponseStatus(HttpStatus.ACCEPTED)
    DataSingular<BudgetData> update(@PathVariable("id") Long id, @RequestBody DataSingular<BudgetData> data) {
        try {
            var budget = budgetService.update(id, fromDto(data.data())).orElseThrow(() -> new RequestException(404, "BUDGET_NOT_FOUND"));
            return new DataSingular<>(new BudgetData(budget.getId(), "budget", toDto(budget)));
        } catch (RestException ex) {
            throw new RequestException(ex.getStatus(), ex.getTitle(), ex);
        }
    }

    @DeleteMapping("/api/budget/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable("id") Long id) {
        budgetService.delete(id);
    }

    @GetMapping(value = "/api/budget/{id}/entry/{entryId}", produces = "application/vnd.mdg+json")
    DataSingular<BudgetEntryData> getEntry(@PathVariable("id") Long id, @PathVariable("entryId") Long entryId) {
        var entry =  budgetService.getBudgetEntry(entryId).orElseThrow(() -> new RestException("BUDGETENTRY_NOT_FOUND", 404, "/api/budget/%d/entry/%d".formatted(id, entryId)));
        return new DataSingular<>(new BudgetEntryData(entry.getId(), "budgetentry", toDto(entry)));
    }


    @GetMapping(value = "/api/budget/{id}/entry", produces = "application/vnd.mdg+json")
    DataPlural<BudgetEntryData> listEntry(@PathVariable("id") Long id) {
        return new DataPlural<>(budgetService.listEntries(id).stream().map(b -> new BudgetEntryData(b.getId(), "budgetentry", toDto(b))).toList());
    }

    @PutMapping(value = "/api/budget/{id}/entry/{entryId}", consumes = {"application/vnd.mdg+json", "application/json"}, produces = "application/vnd.mdg+json")
    @ResponseStatus(HttpStatus.ACCEPTED)
    DataSingular<BudgetEntryData> updateEntry(@PathVariable("entryId") Long entryId, @RequestBody DataSingular<BudgetEntryData> data) {
        try {
            var entry = budgetService.updateBudgetEntry(entryId, fromDto(data.data())).orElseThrow(() -> new RequestException(404, "BUDGETENTRY_NOT_FOUND"));
            return new DataSingular<>(new BudgetEntryData(entry.getId(), "budgetentry", toDto(entry)));
        } catch (RestException ex) {
            throw new RequestException(ex.getStatus(), ex.getTitle(), ex);
        }
    }
}
