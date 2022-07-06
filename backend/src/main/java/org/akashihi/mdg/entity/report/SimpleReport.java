package org.akashihi.mdg.entity.report;

import java.time.LocalDate;
import java.util.Collection;

public record SimpleReport(Collection<LocalDate> dates, Collection<ReportSeries> series) { }
