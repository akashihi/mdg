package org.akashihi.mdg.dao.projections

import java.math.BigDecimal
import java.time.LocalDate

interface AmountAndDate {
    val amount: BigDecimal
    val dt: LocalDate
}
