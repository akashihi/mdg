package org.akashihi.mdg.entity.report

import java.math.BigDecimal

data class HierarchicalSeriesEntry (val id: String, val parent: String?, val name: String, val value: BigDecimal?)