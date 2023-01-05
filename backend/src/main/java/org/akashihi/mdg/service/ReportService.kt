package org.akashihi.mdg.service

import lombok.RequiredArgsConstructor
import org.akashihi.mdg.dao.AccountRepository
import org.akashihi.mdg.dao.projections.AmountAndName
import org.akashihi.mdg.entity.Account
import org.akashihi.mdg.entity.AccountType
import org.akashihi.mdg.entity.Budget
import org.akashihi.mdg.entity.Category
import org.akashihi.mdg.entity.report.Amount
import org.akashihi.mdg.entity.report.BudgetExecutionReport
import org.akashihi.mdg.entity.report.ReportSeries
import org.akashihi.mdg.entity.report.ReportSeriesEntry
import org.akashihi.mdg.entity.report.SimpleReport
import org.akashihi.mdg.entity.report.TotalsReport
import org.akashihi.mdg.entity.report.TotalsReportEntry
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import java.util.function.Function
import java.util.stream.Collectors
import java.util.stream.IntStream
import java.util.stream.LongStream
import java.util.stream.Stream

@Service
@RequiredArgsConstructor
class ReportService {
    private val accountService: AccountService? = null
    private val settingService: SettingService? = null
    private val accountRepository: AccountRepository? = null
    private val budgetService: BudgetService? = null
    fun totalsReport(): TotalsReport {
        val primaryCurrency = settingService!!.currentCurrencyPrimary()
        val primaryCurrencyCode: String
        primaryCurrencyCode = primaryCurrency?.code ?: ""
        val primaryCurrencyComparator = Comparator { l: Amount, r: Amount ->
            if (l.name == primaryCurrencyCode) {
                return@Comparator -1
            } else {
                return@Comparator l.name.compareTo(r.name)
            }
        }
        val accounts = accountService!!.listByType(AccountType.ASSET)
            .stream().collect(Collectors.groupingBy(Account::category))
        val totals = ArrayList<TotalsReportEntry>()
        val orderedCategories = accounts.keys.sortedBy { it?.priority }.toList()
        for (totalsCategory in orderedCategories) {
            val currencyGroups = accounts[totalsCategory]!!.stream().collect(Collectors.groupingBy(Account::currency))
            val currencyTotals = ArrayList<Amount>()
            //Only fill detailed totals if there is more than just primary currency
            for ((key, value) in currencyGroups) {
                val totalAmount = value.stream().map(Account::balance).reduce(BigDecimal.ZERO) { obj: BigDecimal, augend: BigDecimal? -> obj.add(augend) }
                if (totalAmount.compareTo(BigDecimal.ZERO) != 0) { //Only add non-zero currencies
                    currencyTotals.add(Amount(totalAmount, key!!.code, null))
                }
            }
            currencyTotals.sortedWith(primaryCurrencyComparator)
            if (currencyTotals.size == 1 && primaryCurrencyCode == currencyTotals[0].name) {
                currencyTotals.clear() // Drop totals if only primary currency is filled
            }
            val primaryTotal = accounts[totalsCategory]!!.stream().map(Account::primaryBalance).reduce(BigDecimal.ZERO) { obj: BigDecimal, augend: BigDecimal? -> obj.add(augend) }
            totals.add(TotalsReportEntry(totalsCategory!!.name, primaryTotal, currencyTotals))
        }
        return TotalsReport(totals)
    }

    fun simpleAssetReport(from: LocalDate, to: LocalDate?, granularity: Int): SimpleReport {
        val dates = expandPeriod(from, to, granularity)
        val amounts = dates.stream().map { d: LocalDate? -> accountRepository!!.getTotalAssetsForDate(d!!) ?: (BigDecimal.ZERO).setScale(2, RoundingMode.DOWN) }.map { a: BigDecimal -> ReportSeriesEntry(a, a) }
            .toList()
        val series = ReportSeries("Total assets", amounts, "area")
        return SimpleReport(dates, listOf(series))
    }

    protected fun amountInvertForIncome(amount: AmountAndName, type: AccountType): AmountAndName {
        return if (type === AccountType.INCOME) {
            object : AmountAndName {
                override fun getAmount(): BigDecimal {
                    return amount.amount.negate()
                }

                override fun getPrimaryAmount(): BigDecimal {
                    return amount.primaryAmount.negate()
                }

                override fun getName(): String {
                    return amount.name
                }
            }
        } else {
            amount
        }
    }

    protected fun amountToSeries(amounts: Stream<AmountAndName?>, type: String?): Collection<ReportSeries> {
        return amounts.collect(Collectors.groupingBy(Function { obj: AmountAndName? -> obj!!.name })).entries.stream().map { (key, value): Map.Entry<String, List<AmountAndName?>> ->
            val data = value.stream().map { an: AmountAndName? ->
                ReportSeriesEntry(
                    an!!.primaryAmount, an.amount
                )
            }.toList()
            ReportSeries(key, data, type) // Area is the default type
        }
            .filter { s: ReportSeries -> !s.data.stream().map(ReportSeriesEntry::y).allMatch { v: BigDecimal -> v.compareTo(BigDecimal.ZERO) == 0 } }
            .toList()
    }

    protected fun typedAssetReportReport(from: LocalDate, to: LocalDate?, granularity: Int, query: Function<LocalDate?, List<AmountAndName?>?>): SimpleReport {
        val dates = expandPeriod(from, to, granularity)
        val amounts = dates.stream()
            .flatMap { d: LocalDate? -> query.apply(d)!!.stream() }
        return SimpleReport(dates, amountToSeries(amounts, "area"))
    }

    fun assetByCurrencyReport(from: LocalDate, to: LocalDate?, granularity: Int): SimpleReport {
        return typedAssetReportReport(from, to, granularity) { dt: LocalDate? ->
            accountRepository!!.getTotalAssetsForDateByCurrency(
                dt!!
            )
        }
    }

    fun assetByTypeReport(from: LocalDate, to: LocalDate?, granularity: Int): SimpleReport {
        return typedAssetReportReport(from, to, granularity) { dt: LocalDate? -> accountRepository!!.getTotalAssetsForDateByType(dt!!) }
    }

    fun eventsByAccountReport(from: LocalDate, to: LocalDate?, granularity: Int, type: AccountType): SimpleReport {
        val dates = expandPeriod(from, to, granularity)
        val amounts = IntStream.range(0, dates.size - 2 + 1)
            .mapToObj { start: Int -> dates.subList(start, start + 2) }
            .flatMap { d: List<LocalDate?> ->
                accountRepository!!.getTotalByAccountTypeForRange(type.toDbValue(), d[0]!!, d[1]!!)!!
                    .stream()
            }
            .map { a: AmountAndName? -> amountInvertForIncome(a!!, type) }
        return SimpleReport(dates, amountToSeries(amounts, "column"))
    }

    fun structureReport(from: LocalDate, to: LocalDate?, type: AccountType): SimpleReport {
        val totals = accountRepository!!.getTotalByAccountTypeForRange(type.toDbValue(), from, to!!)!!
            .stream().map { a: AmountAndName? -> amountInvertForIncome(a!!, type) }
        return SimpleReport(listOf(from), amountToSeries(totals, "pie"))
    }

    fun budgetExecutionReport(from: LocalDate?, to: LocalDate?): BudgetExecutionReport {
        val budgets = budgetService!!.listInRange(from!!, to!!)
        val dates = budgets.stream().map(Budget::beginning).toList()
        val actualIncomes:List<BigDecimal> = budgets.stream().map( { b: Budget -> b.state!!.income.actual }).toList()
        val actualExpenses:List<BigDecimal> = budgets.stream().map( { b: Budget -> b.state!!.expense.actual.negate() }).toList()
        val expectedIncomes:List<BigDecimal> = budgets.stream().map( { b: Budget -> b.state!!.income.expected }).toList()
        val expectedExpenses:List<BigDecimal> = budgets.stream().map( { b: Budget -> b.state!!.expense.expected.negate() }).toList()
        val profits = budgets.stream().map { b: Budget -> b.outgoingAmount!!.actual.subtract(b.incomingAmount).setScale(2, RoundingMode.DOWN) }.toList()
        return BudgetExecutionReport(dates, actualIncomes, actualExpenses, expectedIncomes, expectedExpenses, profits)
    }

    companion object {
        protected fun expandPeriod(from: LocalDate, to: LocalDate?, granularity: Int): List<LocalDate?> {
            val numberOfDays = ChronoUnit.DAYS.between(from, to) / granularity
            val days = ArrayList(LongStream.range(0, numberOfDays).mapToObj { d: Long -> from.plusDays(d * granularity) }.toList())
            days.add(to)
            return days
        }
    }
}