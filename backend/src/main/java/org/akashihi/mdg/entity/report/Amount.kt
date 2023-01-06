package org.akashihi.mdg.entity.report

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import java.math.BigDecimal
import java.time.LocalDate

data class Amount(val amount: BigDecimal, val name: String, @field:JsonInclude(JsonInclude.Include.NON_NULL) val date: LocalDate?)