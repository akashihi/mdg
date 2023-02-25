package org.akashihi.mdg.dao.projections

import java.time.LocalDate

interface AmountDateName : AmountAndName {
    val dt: LocalDate
}
