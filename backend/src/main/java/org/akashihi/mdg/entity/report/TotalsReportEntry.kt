package org.akashihi.mdg.entity.report;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.Collection;

public record TotalsReportEntry(@JsonProperty("category_name") String categoryName,@JsonProperty("primary_balance")  BigDecimal primaryBalance, Collection<Amount> amounts) { }
