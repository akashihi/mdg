package org.akashihi.mdg.service

import org.akashihi.mdg.api.v1.MdgException
import org.akashihi.mdg.dao.AccountRepository
import org.akashihi.mdg.dao.BudgetEntryRepository
import org.akashihi.mdg.dao.BudgetRepository
import org.akashihi.mdg.dao.BudgetSpecification
import org.akashihi.mdg.entity.Account
import org.akashihi.mdg.entity.AccountType
import org.akashihi.mdg.entity.Budget
import org.akashihi.mdg.entity.BudgetEntry
import org.akashihi.mdg.entity.BudgetEntryMode
import org.akashihi.mdg.entity.BudgetPair
import org.akashihi.mdg.entity.BudgetState
import org.akashihi.mdg.entity.Currency
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import java.util.*
import javax.transaction.Transactional

data class ListResult<T>(val items: List<T>, val left: Long)

@Service
open class BudgetService(private val accountRepository: AccountRepository, private val budgetRepository: BudgetRepository, private val budgetEntryRepository: BudgetEntryRepository, private val transactionService: TransactionService, private val rateService: RateService) {
    private fun validateBudget(budget: Budget): Boolean {
        if (budget.beginning.isAfter(budget.end)) {
            throw MdgException("BUDGET_INVALID_TERM")
        }
        if (ChronoUnit.DAYS.between(budget.beginning, budget.end) < 1) {
            throw MdgException("BUDGET_SHORT_RANGE")
        }
        if (budgetRepository.existsByEndGreaterThanEqualAndBeginningLessThanEqual(budget.beginning, budget.end)) {
            throw MdgException("BUDGET_OVERLAPPING")
        }
        return true
    }

    private fun applyActualAmount(entry: BudgetEntry): BudgetEntry {
        val from = entry.budget.beginning
        val to = entry.budget.end

        // Find actual spendings
        entry.actualAmount = entry.account?.let { transactionService.spendingOverPeriod(from.atTime(0, 0), to.atTime(23, 59), it) } ?: BigDecimal.ZERO
        if (entry.account?.accountType === AccountType.INCOME) {
            entry.actualAmount = entry.actualAmount.negate()
        }
        return entry
    }

    @Transactional
    open fun create(budget: Budget): Budget {
        validateBudget(budget)
        val id = budget.beginning.format(DateTimeFormatter.BASIC_ISO_DATE)
        budget.id = id.toLong()
        budgetRepository.save(budget)
        log.info("Created budget {}", budget)
        return budget
    }

    @Transactional
    open fun list(limit: Int?, pointer: Long?): ListResult<Budget> {
        val sorting = Sort.by("beginning").descending()
        if (limit == null) {
            return ListResult(budgetRepository.findAll(sorting), 0L)
        }
        val pageLimit = PageRequest.of(0, limit, sorting)
        val page = if (pointer == null) {
            budgetRepository.findAll(pageLimit)
        } else {
            val spec = BudgetSpecification.followingBudgets(pointer)
            budgetRepository.findAll(spec, pageLimit)
        }
        var left = page.totalElements - limit
        if (left < 0) {
            left = 0 // Clamp value in case last page is shorter than limit
        }
        return ListResult(page.content, left)
    }

    @Transactional
    open fun listInRange(from: LocalDate, to: LocalDate): Collection<Budget> {
        return budgetRepository.findByBeginningGreaterThanEqualAndEndIsLessThanEqualOrderByBeginningAsc(from, to)
            .map { budget: Budget -> enrichBudget(budget) }
            .toList()
    }

    private fun applyRateForEntry(amount: BigDecimal, entry: BudgetEntry): BigDecimal = entry.account?.currency?.let { rateService.toCurrentDefaultCurrency(it, amount) } ?: amount

    private fun getActualExpectedForDate(from: LocalDate, to: LocalDate, entries: Collection<BudgetEntry>, type: AccountType): BudgetPair {
        val actual = entries
            .filter { it.account?.accountType == type }
            .map { entry ->
                @Suppress("MagicNumber")
                val amount = entry.account?.let { transactionService.spendingOverPeriod(from.atTime(0, 0), to.atTime(23, 59), it) } ?: BigDecimal.ZERO
                applyRateForEntry(amount, entry)
            }.fold(BigDecimal.ZERO) { obj: BigDecimal, augend: BigDecimal -> obj.add(augend) }
        val expected = entries
            .filter { it.account?.accountType == type }
            .map { applyRateForEntry(it.expectedAmount, it) }
            .fold(BigDecimal.ZERO) { obj: BigDecimal, augend: BigDecimal? -> obj.add(augend) }
        return BudgetPair(actual, expected)
    }

    private fun getActualAndAllowedForDate(from: LocalDate, to: LocalDate, entries: Collection<BudgetEntry>): BudgetPair {
        val actual = entries
            .filter { it.account?.accountType == AccountType.EXPENSE }
            .map { e: BudgetEntry ->
                @Suppress("MagicNumber")
                val amount = e.account?.let { transactionService.spendingOverPeriod(from.atTime(0, 0), to.atTime(23, 59), it) } ?: BigDecimal.ZERO
                applyRateForEntry(amount, e)
            }.fold(BigDecimal.ZERO) { obj: BigDecimal, augend: BigDecimal? -> obj.add(augend) }
        val expected = entries
            .filter { it.account?.accountType == AccountType.EXPENSE }
            .map { applyRateForEntry(it.allowedSpendings, it) }
            .fold(BigDecimal.ZERO) { obj: BigDecimal, augend: BigDecimal? -> obj.add(augend) }
        return BudgetPair(actual, expected)
    }

    private fun getActualExpectedForBudget(budget: Budget, entries: Collection<BudgetEntry>, type: AccountType): BudgetPair {
        return getActualExpectedForDate(budget.beginning, budget.end, entries, type)
    }

    @Transactional
    open operator fun get(id: Long): Budget? {
        val budget = budgetRepository.findFirstByIdLessThanEqualOrderByIdDesc(id) ?: return null
        return enrichBudget(budget)
    }

    private fun enrichBudget(budget: Budget): Budget {
        val incomingAmount = accountRepository.getTotalAssetsForDate(budget.beginning) ?: BigDecimal.ZERO
        budget.incomingAmount = incomingAmount
        val outgoingActual = accountRepository.getTotalAssetsForDate(budget.end.plusDays(1)) ?: BigDecimal.ZERO
        val entries = budgetEntryRepository.findByBudget(budget)
            .map { applyActualAmount(it) }
            .map { analyzeSpendings(it, LocalDate.now()) }
            .toList()
        val outgoingExpected = entries
            .map {
                var amount = it.expectedAmount
                if (it.account?.accountType == AccountType.EXPENSE) {
                    amount = amount.negate() // Expense account decrease expected performance
                }
                applyRateForEntry(amount, it)
            }
            .fold(incomingAmount) { obj: BigDecimal, augend: BigDecimal -> obj.add(augend) }
        val outgoing = BudgetPair(outgoingActual, outgoingExpected)
        budget.outgoingAmount = outgoing
        var incomeTotals = getActualExpectedForBudget(budget, entries, AccountType.INCOME)
        incomeTotals = BudgetPair(incomeTotals.actual.negate(), incomeTotals.expected) // Incomes are subtractions from income account, so they are always negative. But for the budget purposes it should be positive
        val expenseTotals = getActualExpectedForBudget(budget, entries, AccountType.EXPENSE)
        var allowedSpendingsTotals = BudgetPair(BigDecimal.ZERO, BigDecimal.ZERO)
        if (budget.beginning <= LocalDate.now() && budget.end >= LocalDate.now()) {
            // We are outside of budget's period, no spendings allowed
            allowedSpendingsTotals = getActualAndAllowedForDate(LocalDate.now(), LocalDate.now(), entries)
        }
        val state = BudgetState(incomeTotals, expenseTotals, allowedSpendingsTotals)
        budget.state = state
        return budget
    }

    @Transactional
    open fun update(id: Long, newBudget: Budget): Budget? {
        validateBudget(newBudget)
        val budget = budgetRepository.findByIdOrNull(id) ?: return null
        budget.beginning = newBudget.beginning
        budget.end = newBudget.end
        budgetRepository.save(budget)
        return budget
    }

    @Transactional
    open fun updateCurrencyForAccount(account: Account, newCurrency: Currency) {
        // We should iterate over all budgets
        // Find their beginning dates
        // Detect the rate between old and new currencies for that date
        // And apply that rate to the respective budget entry
        for (budget in budgetRepository.findAll()) {
            val rate = account.currency?.let { rateService.getPair(budget.beginning.atTime(0, 0), it, newCurrency) }
            if (rate != null) {
                val entry = budgetEntryRepository.findByBudget(budget).firstOrNull { it.account == account } // Should be always one entry per account
                if (entry != null) {
                    entry.expectedAmount = entry.expectedAmount.multiply(rate.rate)
                    budgetEntryRepository.save(entry)
                }
            }
        }
    }

    @Transactional
    open fun getBudgetEntry(entryId: Long): BudgetEntry? {
        val entry = budgetEntryRepository.findByIdOrNull(entryId) ?: return null
        applyActualAmount(entry)
        // Apply spendings analysis
        return analyzeSpendings(entry, LocalDate.now())
    }

    @Transactional
    open fun updateBudgetEntry(entryId: Long, newEntry: BudgetEntry): BudgetEntry? {
        val entry = budgetEntryRepository.findByIdOrNull(entryId) ?: return null
        if (newEntry.expectedAmount >= BigDecimal.ZERO) {
            entry.expectedAmount = newEntry.expectedAmount
        } else {
            throw MdgException("BUDGETENTRY_IS_NEGATIVE")
        }
        entry.distribution = newEntry.distribution
        applyActualAmount(entry)
        analyzeSpendings(entry, LocalDate.now())
        budgetEntryRepository.save(entry)
        return entry
    }

    @Transactional
    open fun listEntries(budgetId: Long): Collection<BudgetEntry> {
        val budget = this[budgetId] ?: return emptyList()
        val today = LocalDate.now()
        val entries = budgetEntryRepository.findByBudget(budget)
        entries.forEach {
            applyActualAmount(it)
            analyzeSpendings(it, today)
        }
        return entries
    }

    @Transactional
    open fun delete(id: Long) = budgetRepository.deleteById(id)

    companion object {
        fun getSpendingPercent(actualAmount: BigDecimal, expectedAmount: BigDecimal): BigDecimal {
            if (expectedAmount.compareTo(BigDecimal.ZERO) == 0) {
                return BigDecimal.valueOf(100L)
            }
            var value = actualAmount.setScale(2, RoundingMode.HALF_UP).divide(expectedAmount, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100L)).setScale(0, RoundingMode.HALF_UP)
            if (value > BigDecimal.valueOf(100L)) {
                value = BigDecimal.valueOf(100L) // Cap overspending to 100%
            }
            return value
        }

        @JvmStatic
        fun getAllowedSpendings(actualAmount: BigDecimal, expectedAmount: BigDecimal, from: LocalDate, to: LocalDate, forDay: LocalDate, mode: BudgetEntryMode): BigDecimal {
            if (forDay.isBefore(from.minusDays(1)) || forDay.isAfter(to)) {
                // We are out of that budget, no spendings are allowed
                return BigDecimal.ZERO
            }
            val budgetLength = BigDecimal.valueOf(ChronoUnit.DAYS.between(from.minusDays(1), to)) // Including first day
            val daysLeft = BigDecimal.valueOf(ChronoUnit.DAYS.between(forDay.minusDays(1), to)) // Including today
            val daysPassed = BigDecimal.valueOf(ChronoUnit.DAYS.between(from.minusDays(1), forDay)) // Including first day and today
            var allowed = BigDecimal.ZERO
            if (mode == BudgetEntryMode.PRORATED) {
                allowed = expectedAmount.divide(budgetLength, RoundingMode.HALF_DOWN).multiply(daysPassed).subtract(actualAmount)
            }
            if (mode == BudgetEntryMode.EVEN || allowed < BigDecimal.ZERO) { // Negative prorations are re-calculated in the even mode
                allowed = expectedAmount.subtract(actualAmount).divide(daysLeft, RoundingMode.HALF_DOWN)
            }
            if (mode == BudgetEntryMode.SINGLE) {
                // Not evenly distributed, spend everything left
                allowed = expectedAmount.subtract(actualAmount)
            }
            if (allowed < BigDecimal.ZERO) {
                // Nothing to spend
                allowed = BigDecimal.ZERO
            }
            return allowed.setScale(0, RoundingMode.HALF_DOWN)
        }

        fun analyzeSpendings(entry: BudgetEntry, forDay: LocalDate): BudgetEntry {
            entry.spendingPercent = getSpendingPercent(entry.actualAmount, entry.expectedAmount)
            val from = entry.budget.beginning
            val to = entry.budget.end
            entry.allowedSpendings = getAllowedSpendings(entry.actualAmount, entry.expectedAmount, from, to, forDay, entry.distribution)
            return entry
        }

        @Suppress("JAVA_CLASS_ON_COMPANION")
        @JvmStatic
        private val log = LoggerFactory.getLogger(javaClass.enclosingClass)
    }
}
