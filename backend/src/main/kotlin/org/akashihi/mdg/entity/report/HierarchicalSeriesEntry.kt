package org.akashihi.mdg.entity.report

import com.fasterxml.jackson.annotation.JsonInclude
import java.math.BigDecimal

data class HierarchicalSeriesEntry(val id: String, @field:JsonInclude(JsonInclude.Include.NON_NULL) val parent: String?, val name: String, @field:JsonInclude(JsonInclude.Include.NON_NULL) val value: BigDecimal?)
