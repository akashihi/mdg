package org.akashihi.mdg.service

import org.akashihi.mdg.dao.AccountRepository
import org.akashihi.mdg.dao.projections.AmountAndName
import org.akashihi.mdg.dao.projections.AmountNameCategory
import org.akashihi.mdg.entity.AccountType
import org.akashihi.mdg.entity.Budget
import org.akashihi.mdg.entity.BudgetEntryMode
import org.akashihi.mdg.entity.Category
import org.akashihi.mdg.entity.report.Amount
import org.akashihi.mdg.entity.report.BudgetCashflowReport
import org.akashihi.mdg.entity.report.BudgetExecutionReport
import org.akashihi.mdg.entity.report.EvaluationReport
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
        val accounts = accountService.listByType(AccountType.ASSET).groupBy { it.category ?: Category(AccountType.ASSET, "", 0, children = emptyList()) } // There should be one category, but something went wrong ¯\_(ツ)_/¯
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
                if (!entries.containsKey(it.categoryId.toString())) { // Fill missing hierarchy
                    var category = categoryService[it.categoryId!!]
                    while (category != null) {
                        if (!entries.containsKey(category.id.toString())) {
                            entries[category.id.toString()] = HierarchicalSeriesEntry(category.id.toString(), category.parentId?.toString() ?: "root", category.name, null)
                        }
                        category = category.parentId?.let { c -> categoryService[c] }
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

    fun evaluationReport(): EvaluationReport {
        // Income evaluation
        val registeredIncome = accountRepository.getTotalByAccountTypeForRange(AccountType.INCOME.toDbValue(), LocalDate.now().minusMonths(3), LocalDate.now()).map { it.primaryAmount.negate() }.fold(BigDecimal.ZERO) { acc: BigDecimal, r: BigDecimal -> acc.add(r) }
        val registeredExpense = accountRepository.getTotalByAccountTypeForRange(AccountType.EXPENSE.toDbValue(), LocalDate.now().minusMonths(3), LocalDate.now()).map { it.primaryAmount }.fold(BigDecimal.ZERO) { acc: BigDecimal, r: BigDecimal -> acc.add(r) }
        val balance = registeredIncome.subtract(registeredExpense)
        var balanceRatio = 0L
        if (registeredIncome.compareTo(BigDecimal.ZERO) != 0) {
            balanceRatio = balance.divide(registeredIncome, 1, RoundingMode.HALF_UP).multiply(BigDecimal.TEN).toLong()
        }
        if (balanceRatio > 3) {
            balanceRatio = 3
        } else if (balanceRatio < -3) {
            balanceRatio = -3
        }

        // Debt re-payments evaluation
        val debtCategory = categoryService.list().find { it.name == "Debt" } // This is a predefined category, should be always present
        val totalDebt = debtCategory?.let { c -> accountRepository.getTotalByAccountTypeForRange(AccountType.ASSET.toDbValue(), LocalDate.now().minusMonths(3), LocalDate.now()).filter { it.categoryId == c.id }.map { it.primaryAmount }.fold(BigDecimal.ZERO) { acc: BigDecimal, r: BigDecimal -> acc.add(r) } } ?: BigDecimal.ZERO
        var debtRatio = 0L
        if (registeredIncome.compareTo(BigDecimal.ZERO) != 0) {
            debtRatio = totalDebt.divide(registeredIncome, 2, RoundingMode.HALF_UP).multiply(BigDecimal("100")).toLong()
        }

        // Budget execution evaluation
        val budgets = budgetService.listInRange(LocalDate.now().minusMonths(3), LocalDate.now())
        val actualExpense = budgets.mapNotNull { it.state?.expense?.actual }.fold(BigDecimal.ZERO) { acc: BigDecimal, r: BigDecimal -> acc.add(r) }
        val expectedExpense = budgets.mapNotNull { it.state?.expense?.expected }.fold(BigDecimal.ZERO) { acc: BigDecimal, r: BigDecimal -> acc.add(r) }
        val budgetExecution = expectedExpense.subtract(actualExpense)
        var budgetExecutionRatio = 0L
        if (expectedExpense.compareTo(BigDecimal.ZERO) != 0) {
            budgetExecutionRatio = budgetExecution.divide(expectedExpense, 2, RoundingMode.HALF_UP).multiply(BigDecimal("100")).toLong()
        }
        if (budgetExecutionRatio < 0) {
            budgetExecutionRatio = 0
        }
        if (budgetExecutionRatio > 100) {
            budgetExecutionRatio = 100
        }

        // Wealth evaluation
        val averageIncome = registeredIncome.divide(BigDecimal("3"), 2, RoundingMode.HALF_UP) // Average for 3 months
        val wealth = accountRepository.getTotalAssetsForDate(LocalDate.now()) ?: BigDecimal.ZERO
        var incomeRelation = BigDecimal.ZERO
        if (averageIncome.compareTo(BigDecimal.ZERO) != 0) {
            incomeRelation = wealth.divide(averageIncome, 2, RoundingMode.HALF_UP)
        }
        if (incomeRelation > BigDecimal("12")) {
            incomeRelation = BigDecimal("12") // Clamp to 12 month
        }
        val incomeRatio = incomeRelation.divide(BigDecimal("12"), 2, RoundingMode.HALF_UP).multiply(BigDecimal("100")).toLong()

        // Overall grade (maxgrade is 3  + 2 + 6 = 11
        var grade = balanceRatio
        if (debtRatio in 0..30) {
            grade += 2
        } else if (debtRatio in 31..60) {
            grade += 1
        }
        if (budgetExecutionRatio in 91..99) {
            grade -= 1
        } else if (budgetExecutionRatio in 81..90) {
            grade -= 2
        } else if (budgetExecutionRatio < 81) {
            grade -= 3
        }
        grade += incomeRelation.toLong() / 2

        var gradeScore = ((grade.toFloat() / 11.0) * 100.0).toLong()
        if (gradeScore < 0) {
            gradeScore = 0
        }

        return EvaluationReport(balanceRatio, debtRatio, budgetExecutionRatio, incomeRatio, gradeScore)
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
