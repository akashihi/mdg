package org.akashihi.mdg.entity.report;

import java.math.BigDecimal;
import java.util.Collection;

public record ReportSeries(String name, Collection<ReportSeriesEntry> data, String type) { }
