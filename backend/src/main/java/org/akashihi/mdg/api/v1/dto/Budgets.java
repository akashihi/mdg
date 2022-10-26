package org.akashihi.mdg.api.v1.dto;

import org.akashihi.mdg.entity.Budget;

import java.util.Collection;

public record Budgets(Collection<Budget> budgets, String self, String first, String next, Long left) { }
