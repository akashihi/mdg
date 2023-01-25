package org.akashihi.mdg.service

import org.akashihi.mdg.entity.Budget
import org.akashihi.mdg.entity.BudgetEntry
import org.akashihi.mdg.entity.BudgetEntryMode
import org.akashihi.mdg.service.BudgetService.Companion.getAllowedSpendings
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource
import java.math.BigDecimal
import java.time.LocalDate

internal class BudgetServiceTest {
    @ParameterizedTest
    @CsvSource("25,100,25", "0,0,100", "0,100,0", "100,0,100", "100,100,100", "150,100,100")
    fun testGetSpendingPercent(actualAmount: Long, expectedAmount: Long, expectedPercent: Long) {
        val actualPercent = BudgetService.getSpendingPercent(BigDecimal.valueOf(actualAmount), BigDecimal.valueOf(expectedAmount))
        Assertions.assertEquals(BigDecimal.valueOf(expectedPercent), actualPercent)
    }

    @ParameterizedTest
    @CsvSource("5,false,false,25,100,75", "4,false,false,25,100,0", "5,true,false,25,100,3", "5,true,true,25,100,3", "5,true,true,3,100,12", "5,true,true,130,100,0", "5,true,false,130,100,0", "5,false,false,130,100,0")
    fun analyzeRecommendedSpendings(month: Int, even: Boolean, proration: Boolean, actualAmount: Long, expectedAmount: Long, expectedSpendings: Long) {
        val budget = Budget(LocalDate.now(), LocalDate.now())
        val entry = BudgetEntry(budget, 1L, null, null, null, null, BudgetEntryMode.from(even, proration), BigDecimal.valueOf(expectedAmount), BigDecimal.valueOf(actualAmount), BigDecimal.ZERO, BigDecimal.ZERO )
        val actualAllowed =
            getAllowedSpendings(entry, LocalDate.of(2022, 5, 1), LocalDate.of(2022, 5, 31), LocalDate.of(2022, month, 5))
        Assertions.assertEquals(BigDecimal.valueOf(expectedSpendings), actualAllowed)
    }
}
