package org.akashihi.mdg.entity.report

import java.time.LocalDate

data class BudgetCashflowReport (
    val dates: Collection<LocalDate>,
    val actual: ReportSeries,
    val expected: ReportSeries,
    )
