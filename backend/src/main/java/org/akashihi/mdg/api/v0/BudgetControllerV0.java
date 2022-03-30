package org.akashihi.mdg.api.v0;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v0.dto.BudgetData;
import org.akashihi.mdg.api.v0.dto.DataPlural;
import org.akashihi.mdg.api.v0.dto.DataSingular;
import org.akashihi.mdg.api.v0.dto.RequestException;
import org.akashihi.mdg.api.v1.RestException;
import org.akashihi.mdg.entity.Budget;
import org.akashihi.mdg.service.BudgetService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequiredArgsConstructor
public class BudgetControllerV0 {
    private final BudgetService budgetService;

    private Budget fromDto(BudgetData data) {
        return new Budget(data.getId(), LocalDate.parse(data.getAttributes().term_beginning(), DateTimeFormatter.ISO_LOCAL_DATE), LocalDate.parse(data.getAttributes().term_end(), DateTimeFormatter.ISO_LOCAL_DATE));
    }

    private BudgetData.Attributes toDto(Budget budget) {
        return new BudgetData.Attributes(budget.getBeginning().format(DateTimeFormatter.ISO_LOCAL_DATE), budget.getEnd().format(DateTimeFormatter.ISO_LOCAL_DATE));
    }

    @GetMapping(value = "/api/budget", produces = "application/vnd.mdg+json")
    DataPlural<BudgetData> list() {
        return new DataPlural<>(budgetService.list().stream().map(b -> new BudgetData(b.getId(), "budget", toDto(b))).toList());
    }

    @GetMapping(value = "/api/budget/{id}", produces = "application/vnd.mdg+json")
    DataSingular<BudgetData> get(@PathVariable("id") Long id) {
        var budget =  budgetService.get(id).orElseThrow(() -> new RestException("BUDGET_NOT_FOUND", 404, "/budgets/%d".formatted(id)));
        return new DataSingular<>(new BudgetData(budget.getId(), "budget", toDto(budget)));
    }

    @PostMapping(value = "/api/budget", consumes = {"application/vnd.mdg+json", "application/json"}, produces = "application/vnd.mdg+json")
    @ResponseStatus(HttpStatus.CREATED)
    DataSingular<BudgetData> addBudget(@RequestBody DataSingular<BudgetData> data) {
        try {
            var budget= budgetService.create(fromDto(data.data()));
            return new DataSingular<>(new BudgetData(budget.getId(), "budget", toDto(budget)));
        } catch (RestException ex) {
            throw new RequestException(ex.getStatus(), ex.getTitle());
        }
    }

    @PutMapping(value = "/api/budget/{id}", consumes = {"application/vnd.mdg+json", "application/json"}, produces = "application/vnd.mdg+json")
    @ResponseStatus(HttpStatus.ACCEPTED)
    DataSingular<BudgetData> update(@PathVariable("id") Long id, @RequestBody DataSingular<BudgetData> data) {
        try {
            var budget = budgetService.update(id, fromDto(data.data())).orElseThrow(() -> new RequestException(404, "BUDGET_NOT_FOUND"));
            return new DataSingular<>(new BudgetData(budget.getId(), "budget", toDto(budget)));
        } catch (RestException ex) {
            throw new RequestException(ex.getStatus(), ex.getTitle());
        }
    }

    @DeleteMapping(value = "/api/budget/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable("id") Long id) {
        budgetService.delete(id);
    }

}
