package org.akashihi.mdg.entity.report

import com.fasterxml.jackson.annotation.JsonProperty
import java.math.BigDecimal

data class TotalsReportEntry(
    @field:JsonProperty("category_name") val categoryName: String,
    @field:JsonProperty("primary_balance") val primaryBalance: BigDecimal,
    val amounts: Collection<Amount>
)
