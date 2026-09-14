package org.akashihi.mdg.service

import org.akashihi.mdg.dao.AccountRepository
import org.akashihi.mdg.dao.BudgetEntryRepository
import org.akashihi.mdg.dao.BudgetRepository
import org.akashihi.mdg.entity.Budget
import org.akashihi.mdg.entity.BudgetEntry
import org.akashihi.mdg.entity.BudgetEntryMode
import org.akashihi.mdg.service.BudgetService.Companion.getAllowedSpendings
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource
import org.junit.jupiter.params.provider.ValueSource
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import java.math.BigDecimal
import java.time.LocalDate
import java.util.Optional

@ExtendWith(MockitoExtension::class)
internal class BudgetServiceTest(@Mock private val accountRepository: AccountRepository,
                                 @Mock private val budgetRepository: BudgetRepository,
                                 @Mock private val budgetEntryRepository: BudgetEntryRepository,
                                 @Mock private val transactionService: TransactionService,
                                 @Mock private val rateService: RateService) {

    private val budgetService = BudgetService(accountRepository, budgetRepository, budgetEntryRepository, transactionService, rateService)

    private val januaryBudget = Budget(LocalDate.of(2031, 1, 1), LocalDate.of(2031, 1, 31), id = 20310101L)
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

    @ParameterizedTest
    @CsvSource("-2,25,100,75", "0,25,100,75", "2,25,100,0")
    fun analyzeScheduledSpendings(dayShift: Long, actualAmount: Long, expectedAmount: Long, expectedSpendings: Long) {
        val budget = Budget(LocalDate.now(), LocalDate.now())
        val spendingDate = LocalDate.of(2022, 5, 5).plusDays(dayShift)
        val entry = BudgetEntry(budget, 1L, null, null, null, spendingDate, BudgetEntryMode.SINGLE, BigDecimal.valueOf(expectedAmount), BigDecimal.valueOf(actualAmount), BigDecimal.ZERO, BigDecimal.ZERO )
        val actualAllowed =
            getAllowedSpendings(entry, LocalDate.of(2022, 5, 1), LocalDate.of(2022, 5, 31), LocalDate.of(2022, 5, 5))
        Assertions.assertEquals(BigDecimal.valueOf(expectedSpendings), actualAllowed)
    }

    @Test
    fun resolvesExactIdBeforeDate() {
        // A budget created on 2031-01-15 and later moved to March keeps its id
        val movedBudget = Budget(LocalDate.of(2031, 3, 1), LocalDate.of(2031, 3, 31), id = 20310115L)
        Mockito.`when`(budgetRepository.findById(20310115L)).thenReturn(Optional.of(movedBudget))
        Mockito.lenient().`when`(budgetRepository.findFirstByBeginningLessThanEqualAndEndGreaterThanEqual(any(), any())).thenReturn(januaryBudget)
        Assertions.assertSame(movedBudget, budgetService.simplifiedGet(20310115L))
    }

    @Test
    fun resolvesDateToCoveringBudget() {
        val date = LocalDate.of(2031, 1, 15)
        Mockito.`when`(budgetRepository.findFirstByBeginningLessThanEqualAndEndGreaterThanEqual(date, date)).thenReturn(januaryBudget)
        Assertions.assertSame(januaryBudget, budgetService.simplifiedGet(20310115L))
    }

    @ParameterizedTest
    @ValueSource(longs = [1L, 999999L, 20171345L, 20170229L, -20310101L, 123450101L])
    fun doesNotResolveIdThatIsNotADate(id: Long) {
        Mockito.lenient().`when`(budgetRepository.findFirstByBeginningLessThanEqualAndEndGreaterThanEqual(any(), any())).thenReturn(januaryBudget)
        Assertions.assertNull(budgetService.simplifiedGet(id))
    }
}
