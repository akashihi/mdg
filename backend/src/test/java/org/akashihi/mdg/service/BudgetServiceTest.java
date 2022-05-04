package org.akashihi.mdg.service;

import org.akashihi.mdg.entity.Budget;
import org.akashihi.mdg.entity.BudgetEntry;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

class BudgetServiceTest {

    @ParameterizedTest
    @CsvSource({"25,100,25", "0,0,100", "0,100,0", "100,0,100", "100,100,100", "150,100,100"})
    void analyzeSpendingsPercent(Long actualAmount, Long expectedAmount, Long expectedPercent) {
        var budget = new Budget(1L, LocalDate.now(), LocalDate.now().plusDays(2));
        var entry = new BudgetEntry();
        entry.setBudget(budget);
        entry.setActualAmount(BigDecimal.valueOf(actualAmount));
        entry.setExpectedAmount(BigDecimal.valueOf(expectedAmount));

        BudgetService.analyzeSpendings(entry, LocalDate.now());

        assertEquals(BigDecimal.valueOf(expectedPercent), entry.getSpendingPercent());
    }

    @ParameterizedTest
    @CsvSource({
            "5,false,false,25,100,75",
            "4,false,false,25,100,0",
            "5,true,false,25,100,3",
            "5,true,true,25,100,3",
            "5,true,true,3,100,12",
            "5,true,true,130,100,0",
            "5,true,false,130,100,0",
            "5,false,false,130,100,0"})
    void analyzeRecommendedSpendings(Integer month, Boolean even, Boolean proration, Long actualAmount, Long expectedAmount, Long expectedSpendings) {
        var budget = new Budget(1L, LocalDate.of(2022, 5, 1), LocalDate.of(2022, 5, 31));
        var entry = new BudgetEntry();
        entry.setBudget(budget);
        entry.setActualAmount(BigDecimal.valueOf(actualAmount));
        entry.setExpectedAmount(BigDecimal.valueOf(expectedAmount));

        entry.setEvenDistribution(even);
        entry.setProration(proration);

        BudgetService.analyzeSpendings(entry, LocalDate.of(2022, month, 5));

        assertEquals(BigDecimal.valueOf(expectedSpendings), entry.getAllowedSpendings());

    }
}