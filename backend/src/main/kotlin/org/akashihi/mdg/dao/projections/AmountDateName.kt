package org.akashihi.mdg.dao.projections

import java.math.BigDecimal
import java.time.LocalDate

interface AmountDateName {
    val amount: BigDecimal
    val primaryAmount: BigDecimal
    val name: String
    val dt: LocalDate
}
