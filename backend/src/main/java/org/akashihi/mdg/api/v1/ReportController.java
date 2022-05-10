package org.akashihi.mdg.api.v1;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v1.dto.RateStatus;
import org.akashihi.mdg.entity.report.TotalsReport;
import org.akashihi.mdg.service.ReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @GetMapping(value = "/reports/totals", produces = "application/vnd.mdg+json;version=1")
    public TotalsReport totalsReport() {
        return reportService.totalsReport();
    }
}
