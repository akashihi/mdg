package org.akashihi.mdg.entity.report;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public record Amount(BigDecimal amount, @JsonProperty("currency_code") String currencyCode) { }
