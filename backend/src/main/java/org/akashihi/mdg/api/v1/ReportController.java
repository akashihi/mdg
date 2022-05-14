package org.akashihi.mdg.api.v1;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.entity.AccountType;
import org.akashihi.mdg.entity.report.SimpleReport;
import org.akashihi.mdg.entity.report.TotalsReport;
import org.akashihi.mdg.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @GetMapping(value = "/reports/totals", produces = "application/vnd.mdg+json;version=1")
    public TotalsReport totalsReport() {
        return reportService.totalsReport();
    }

    @GetMapping(value = "/reports/assets/simple", produces = "application/vnd.mdg+json;version=1")
    public SimpleReport simpleAssetsReport(@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate, @RequestParam("granularity") Integer granularity) {
        return reportService.simpleAssetReport(startDate, endDate, granularity);
    }

    @GetMapping(value = "/reports/assets/currency", produces = "application/vnd.mdg+json;version=1")
    public SimpleReport byCurrencyAssetsReport(@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate, @RequestParam("granularity") Integer granularity) {
        return reportService.assetByCurrencyReport(startDate, endDate, granularity);
    }

    @GetMapping(value = "/reports/assets/type", produces = "application/vnd.mdg+json;version=1")
    public SimpleReport byTypeAssetsReport(@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate, @RequestParam("granularity") Integer granularity) {
        return reportService.assetByTypeReport(startDate, endDate, granularity);
    }

    @GetMapping(value = "/reports/income/events", produces = "application/vnd.mdg+json;version=1")
    public SimpleReport incomeEventsReport(@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate, @RequestParam("granularity") Integer granularity) {
        return reportService.eventsByAccountReport(startDate, endDate, granularity, AccountType.INCOME);
    }

    @GetMapping(value = "/reports/expense/events", produces = "application/vnd.mdg+json;version=1")
    public SimpleReport expenseEventsReport(@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate, @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate, @RequestParam("granularity") Integer granularity) {
        return reportService.eventsByAccountReport(startDate, endDate, granularity, AccountType.EXPENSE);
    }
}
