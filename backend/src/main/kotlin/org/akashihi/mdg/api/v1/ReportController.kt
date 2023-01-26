package org.akashihi.mdg.api.v1

import org.akashihi.mdg.entity.AccountType
import org.akashihi.mdg.entity.report.BudgetCashflowReport
import org.akashihi.mdg.entity.report.BudgetExecutionReport
import org.akashihi.mdg.entity.report.SimpleReport
import org.akashihi.mdg.entity.report.TotalsReport
import org.akashihi.mdg.service.ReportService
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@RestController
class ReportController(private val reportService: ReportService) {
    @GetMapping(value = ["/reports/totals"], produces = ["application/vnd.mdg+json;version=1"])
    fun totalsReport(): TotalsReport = reportService.totalsReport()

    @GetMapping(value = ["/reports/assets/simple"], produces = ["application/vnd.mdg+json;version=1"])
    fun simpleAssetsReport(
        @RequestParam("startDate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        startDate: LocalDate,
        @RequestParam("endDate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        endDate: LocalDate,
        @RequestParam("granularity") granularity: Int
    ): SimpleReport = reportService.simpleAssetReport(startDate, endDate, granularity)

    @GetMapping(value = ["/reports/assets/currency"], produces = ["application/vnd.mdg+json;version=1"])
    fun byCurrencyAssetsReport(
        @RequestParam("startDate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        startDate: LocalDate,
        @RequestParam("endDate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        endDate: LocalDate,
        @RequestParam("granularity") granularity: Int
    ): SimpleReport = reportService.assetByCurrencyReport(startDate, endDate, granularity)

    @GetMapping(value = ["/reports/assets/type"], produces = ["application/vnd.mdg+json;version=1"])
    fun byTypeAssetsReport(
        @RequestParam("startDate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        startDate: LocalDate,
        @RequestParam("endDate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        endDate: LocalDate,
        @RequestParam("granularity") granularity: Int
    ): SimpleReport = reportService.assetByTypeReport(startDate, endDate, granularity)

    @GetMapping(value = ["/reports/income/events"], produces = ["application/vnd.mdg+json;version=1"])
    fun incomeEventsReport(
        @RequestParam("startDate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        startDate: LocalDate,
        @RequestParam("endDate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        endDate: LocalDate,
        @RequestParam("granularity") granularity: Int
    ): SimpleReport = reportService.eventsByAccountReport(startDate, endDate, granularity, AccountType.INCOME)

    @GetMapping(value = ["/reports/expense/events"], produces = ["application/vnd.mdg+json;version=1"])
    fun expenseEventsReport(
        @RequestParam("startDate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        startDate: LocalDate,
        @RequestParam("endDate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        endDate: LocalDate,
        @RequestParam("granularity") granularity: Int
    ): SimpleReport = reportService.eventsByAccountReport(startDate, endDate, granularity, AccountType.EXPENSE)

    @GetMapping(value = ["/reports/income/accounts"], produces = ["application/vnd.mdg+json;version=1"])
    fun incomeStructureReport(
        @RequestParam("startDate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        startDate: LocalDate,
        @RequestParam("endDate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        endDate: LocalDate
    ): SimpleReport = reportService.structureReport(startDate, endDate, AccountType.INCOME)

    @GetMapping(value = ["/reports/expense/accounts"], produces = ["application/vnd.mdg+json;version=1"])
    fun expenseStructureReport(
        @RequestParam("startDate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        startDate: LocalDate,
        @RequestParam("endDate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        endDate: LocalDate
    ): SimpleReport = reportService.structureReport(startDate, endDate, AccountType.EXPENSE)

    @GetMapping(value = ["/reports/budget/execution"], produces = ["application/vnd.mdg+json;version=1"])
    fun budgetExecutionReport(
        @RequestParam("startDate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        startDate: LocalDate,
        @RequestParam("endDate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        endDate: LocalDate
    ): BudgetExecutionReport = reportService.budgetExecutionReport(startDate, endDate)

    @GetMapping(value = ["/reports/budget/cashflow/{budget_id}"], produces = ["application/vnd.mdg+json;version=1"])
    fun budgetExecutionReport(
        @PathVariable("budget_id")
        budgetId: Long
    ): BudgetCashflowReport = reportService.budgetCashflowReport(budgetId)
}
