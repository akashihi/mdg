package org.akashihi.mdg.entity.report;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.time.LocalDate;

public record Amount(BigDecimal amount, @JsonProperty("currency_code") String currencyCode, @JsonInclude(JsonInclude.Include.NON_NULL) LocalDate date) { }
