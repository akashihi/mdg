package org.akashihi.mdg.service

import org.akashihi.mdg.dao.AccountRepository
import org.akashihi.mdg.dao.projections.AmountAndName
import org.akashihi.mdg.dao.projections.AmountNameCategory
import org.akashihi.mdg.entity.AccountType
import org.akashihi.mdg.entity.Budget
import org.akashihi.mdg.entity.BudgetEntryMode
import org.akashihi.mdg.entity.report.Amount
import org.akashihi.mdg.entity.report.BudgetCashflowReport
import org.akashihi.mdg.entity.report.BudgetExecutionReport
import org.akashihi.mdg.entity.report.HierarchicalSeriesEntry
import org.akashihi.mdg.entity.report.ReportSeries
import org.akashihi.mdg.entity.report.ReportSeriesEntry
import org.akashihi.mdg.entity.report.SimpleReport
import org.akashihi.mdg.entity.report.TotalsReport
import org.akashihi.mdg.entity.report.TotalsReportEntry
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDate
import java.time.temporal.ChronoUnit

@Service
open class ReportService(
    private val accountService: AccountService,
    private val settingService: SettingService,
    private val accountRepository: AccountRepository,
    private val budgetService: BudgetService,
    private val categoryService: CategoryService
) {
    fun totalsReport(): TotalsReport {
        val primaryCurrency = settingService.currentCurrencyPrimary()
        val primaryCurrencyCode: String = primaryCurrency?.code ?: ""
        val primaryCurrencyComparator = Comparator { l: Amount, r: Amount ->
            if (l.name == primaryCurrencyCode) {
                return@Comparator -1
            } else {
                return@Comparator l.name.compareTo(r.name)
            }
        }
        val accounts = accountService.listByType(AccountType.ASSET).groupBy { it.category!! }
        val totals = ArrayList<TotalsReportEntry>()
        val orderedCategories = accounts.keys.sortedBy { it.priority }
        for (totalsCategory in orderedCategories) {
            val currencyGroups = accounts[totalsCategory]!!.groupBy { it.currency!! }
            val currencyTotals = ArrayList<Amount>()
            // Only fill detailed totals if there is more than just primary currency
            for ((key, value) in currencyGroups) {
                val totalAmount = value.map { it.balance }.fold(BigDecimal.ZERO) { obj: BigDecimal, augend: BigDecimal -> obj.add(augend) }
                if (totalAmount.compareTo(BigDecimal.ZERO) != 0) { // Only add non-zero currencies
                    currencyTotals.add(Amount(totalAmount, key.code, null))
                }
            }
            currencyTotals.sortedWith(primaryCurrencyComparator)
            if (currencyTotals.size == 1 && primaryCurrencyCode == currencyTotals[0].name) {
                currencyTotals.clear() // Drop totals if only primary currency is filled
            }
            val primaryTotal = accounts[totalsCategory]!!.map { it.primaryBalance }.fold(BigDecimal.ZERO) { obj: BigDecimal, augend: BigDecimal -> obj.add(augend) }
            totals.add(TotalsReportEntry(totalsCategory.name, primaryTotal, currencyTotals))
        }
        return TotalsReport(totals)
    }

    fun simpleAssetReport(from: LocalDate, to: LocalDate, granularity: Int): SimpleReport<ReportSeries> {
        val dates = expandPeriod(from, to, granularity)
        val amounts = dates.map { accountRepository.getTotalAssetsForDate(it) ?: BigDecimal.ZERO }.map { it.setScale(2, RoundingMode.DOWN) }.map { ReportSeriesEntry(it, it) }
        val series = ReportSeries("Total assets", amounts, "area")
        return SimpleReport(dates, listOf(series))
    }

    private fun amountInvertForIncome(amount: AmountAndName, type: AccountType): AmountAndName {
        return if (type === AccountType.INCOME) {
            object : AmountAndName {
                override val amount: BigDecimal
                    get() = amount.amount.negate()
                override val primaryAmount: BigDecimal
                    get() = amount.primaryAmount.negate()
                override val name: String
                    get() = amount.name
            }
        } else {
            amount
        }
    }

    private fun amountToSeries(amounts: List<AmountAndName>, type: String): Collection<ReportSeries> {
        return amounts.groupBy { it.name }.map { (key, value) ->
            val data = value.map { an: AmountAndName ->
                ReportSeriesEntry(an.primaryAmount, an.amount)
            }
            ReportSeries(key, data, type) // Area is the default type
        }
            .filter { s: ReportSeries -> !s.data.map { it.y }.all { it.compareTo(BigDecimal.ZERO) == 0 } }
    }

    private fun typedAssetReportReport(from: LocalDate, to: LocalDate, granularity: Int, query: (LocalDate) -> List<AmountAndName>): SimpleReport<ReportSeries> {
        val dates = expandPeriod(from, to, granularity)
        val amounts = dates.flatMap(query)
        return SimpleReport(dates, amountToSeries(amounts, "area"))
    }

    fun assetByCurrencyReport(from: LocalDate, to: LocalDate, granularity: Int): SimpleReport<ReportSeries> = typedAssetReportReport(from, to, granularity, accountRepository::getTotalAssetsForDateByCurrency)

    fun assetByTypeReport(from: LocalDate, to: LocalDate, granularity: Int): SimpleReport<ReportSeries> = typedAssetReportReport(from, to, granularity, accountRepository::getTotalAssetsForDateByType)

    fun eventsByAccountReport(from: LocalDate, to: LocalDate, granularity: Int, type: AccountType): SimpleReport<ReportSeries> {
        val dates = expandPeriod(from, to, granularity)
        val amounts = (0..dates.size - 2)
            .map { dates.subList(it, it + 2) }
            .flatMap { accountRepository.getTotalByAccountTypeForRange(type.toDbValue(), it[0], it[1]) }
            .map { amountInvertForIncome(it, type) }
        return SimpleReport(dates, amountToSeries(amounts, "column"))
    }

    fun structureReport(from: LocalDate, to: LocalDate, type: AccountType): SimpleReport<HierarchicalSeriesEntry> {
        val totals = accountRepository.getTotalByAccountTypeForRange(type.toDbValue(), from, to).map {
            if (type === AccountType.INCOME) {
                object : AmountNameCategory {
                    override val amount: BigDecimal
                        get() = it.amount.negate()
                    override val primaryAmount: BigDecimal
                        get() = it.primaryAmount.negate()
                    override val name: String
                        get() = it.name
                    override val categoryId: Long?
                        get() = it.categoryId
                }
            } else {
                it
            }
        }
        val entries: MutableMap<String, HierarchicalSeriesEntry> = mutableMapOf("root" to HierarchicalSeriesEntry("root", null, type.toString(), null))
        totals.forEach {
            if (it.categoryId == null) {
                entries[it.name] = HierarchicalSeriesEntry(it.name, "root", it.name, it.primaryAmount)
            } else {
                entries[it.name] = HierarchicalSeriesEntry(it.name, it.categoryId.toString(), it.name, it.primaryAmount)
                if (!entries.containsKey(it.categoryId.toString())) { //Fill missing hierarchy
                    var category = categoryService[it.categoryId!!]
                    while (category != null) {
                        if (!entries.containsKey(category.id.toString())) {
                            entries[category.id.toString()] = HierarchicalSeriesEntry(category.id.toString(), category.parentId?.toString() ?: "root", category.name, null)
                        }
                        category = category.parentId?.let {c-> categoryService[c] }
                    }
                }
            }
        }
        return SimpleReport(listOf(from), entries.values)
    }

    fun budgetExecutionReport(from: LocalDate, to: LocalDate): BudgetExecutionReport {
        val budgets = budgetService.listInRange(from, to)
        val dates = budgets.map(Budget::beginning)
        val actualIncomes: List<BigDecimal> = budgets.mapNotNull { b: Budget -> b.state?.income?.actual }
        val actualExpenses: List<BigDecimal> = budgets.mapNotNull { b: Budget -> b.state?.expense?.actual?.negate() }
        val expectedIncomes: List<BigDecimal> = budgets.mapNotNull { b: Budget -> b.state?.income?.expected }
        val expectedExpenses: List<BigDecimal> = budgets.mapNotNull { b: Budget -> b.state?.expense?.expected?.negate() }
        val profits = budgets.mapNotNull { b: Budget -> b.outgoingAmount?.actual?.subtract(b.incomingAmount)?.setScale(2, RoundingMode.DOWN) }
        return BudgetExecutionReport(dates, actualIncomes, actualExpenses, expectedIncomes, expectedExpenses, profits)
    }

    fun budgetCashflowReport(budgetId: Long): BudgetCashflowReport {
        val budget = budgetService[budgetId] ?: return BudgetCashflowReport(emptyList(), ReportSeries("actual", emptyList(), "line"), ReportSeries("actual", emptyList(), "line"))

        val actualBalances = accountRepository.getOperationalAssetsForDateRange(budget.beginning, budget.end)
        val dates = actualBalances.map { it.dt }
        val actualSeries = actualBalances.map { ReportSeriesEntry(it.amount, it.amount) }
        val actual = ReportSeries("Actual operational assets", actualSeries, "area")

        val entries = budgetService.listEntries(budgetId) // TODO THis call pre-calculates actual spendings that we are going to re-calculate. Better to call repository here
        val expectedSpendings = dates.map { dt ->
            val daysLeft = BigDecimal.valueOf(ChronoUnit.DAYS.between(dt.minusDays(1), budget.end)) // Including today

            entries.forEach {
                budgetService.applyActualAmountForPeriod(it, budget.beginning, dt)
                it.allowedSpendings = BigDecimal.ZERO
                if (it.distribution == BudgetEntryMode.SINGLE || it.account?.accountType == AccountType.INCOME) {
                    // Not evenly distributed, spend everything left
                    val opDate = it.dt ?: budget.beginning
                    if (opDate.isEqual(dt)) {
                        it.allowedSpendings = it.expectedAmount
                    }
                } else {
                    // Non-Single spendings are always calculated in the EVEN mode as we can't propagate unspent money during planning (expending spending will constantly grow otherwise)
                    it.allowedSpendings = it.expectedAmount.subtract(it.actualAmount).divide(daysLeft, RoundingMode.HALF_DOWN)
                    if (it.allowedSpendings < BigDecimal.ZERO) {
                        it.allowedSpendings = BigDecimal.ZERO // Clamp to zero in case we are running out of money
                    }
                }
                if (it.account?.accountType == AccountType.EXPENSE) {
                    it.allowedSpendings = it.allowedSpendings.negate() // Expenses will be deducted from the totals
                }
                log.debug("dt: {}, distribution: {}, name: {}, expected: {}, actual: {}, allowed: {}", dt, it.distribution, it.account?.name, it.expectedAmount, it.actualAmount, it.allowedSpendings)
            }
            entries.fold(BigDecimal.ZERO) { acc, e -> acc.add(e.allowedSpendings) }
        }
        var incomingAmount = accountRepository.getTotalOperationalAssetsForDate(budget.beginning) ?: BigDecimal.ZERO
        val expectedBalances = expectedSpendings.map {
            incomingAmount += it
            incomingAmount
        }
        val expectedSeries = expectedBalances.map { ReportSeriesEntry(it, it) }
        val expected = ReportSeries("Expected operational assets", expectedSeries, "line")

        return BudgetCashflowReport(dates, actual, expected)
    }

    companion object {
        fun expandPeriod(from: LocalDate, to: LocalDate, granularity: Int): List<LocalDate> {
            if (granularity == 0) {
                return listOf(from, to)
            }
            val numberOfDays = ChronoUnit.DAYS.between(from, to) / granularity
            val days = (0 until numberOfDays).map { from.plusDays(it * granularity) }
            return days + to
        }

        @Suppress("JAVA_CLASS_ON_COMPANION")
        @JvmStatic
        private val log = LoggerFactory.getLogger(javaClass.enclosingClass)
    }
}
