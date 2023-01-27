package org.akashihi.mdg.entity.report

import java.time.LocalDate

data class SimpleReport<T>(val dates: Collection<LocalDate>, val series: Collection<T>)
