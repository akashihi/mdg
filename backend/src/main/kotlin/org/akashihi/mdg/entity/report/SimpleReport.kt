package org.akashihi.mdg.entity.report

import java.time.LocalDate

data class SimpleReport(val dates: Collection<LocalDate>, val series: Collection<ReportSeries>)
