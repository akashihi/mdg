package org.akashihi.mdg.entity.report;

import org.akashihi.mdg.entity.Budget;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BudgetReportEntry(LocalDate date, Budget.BudgetPair income, Budget.BudgetPair expense, BigDecimal profit) { }
