package org.akashihi.mdg.dao.projections

import java.math.BigDecimal

interface AmountAndName {
    val amount: BigDecimal
    val primaryAmount: BigDecimal
    val name: String
}
