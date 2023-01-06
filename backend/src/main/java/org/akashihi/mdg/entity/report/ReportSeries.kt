package org.akashihi.mdg.entity.report;

import java.util.Collection;

public record ReportSeries(String name, Collection<ReportSeriesEntry> data, String type) { }
