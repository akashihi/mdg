package org.akashihi.mdg.api.v1.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.akashihi.mdg.entity.BudgetEntry;

import java.util.Collection;

public record BudgetEntries(@JsonProperty("budget_entries") Collection<BudgetEntry> budgetEntries) { }
