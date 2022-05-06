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
    void testGetSpendingPercent(Long actualAmount, Long expectedAmount, Long expectedPercent) {
        var actualPercent = BudgetService.getSpendingPercent(BigDecimal.valueOf(actualAmount), BigDecimal.valueOf(expectedAmount));

        assertEquals(BigDecimal.valueOf(expectedPercent), actualPercent);
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
        var actualAllowed = BudgetService.getAllowedSpendings(BigDecimal.valueOf(actualAmount), BigDecimal.valueOf(expectedAmount), LocalDate.of(2022, 5, 1), LocalDate.of(2022, 5, 31), LocalDate.of(2022, month,5 ), even, proration);

        assertEquals(BigDecimal.valueOf(expectedSpendings), actualAllowed);

    }
}