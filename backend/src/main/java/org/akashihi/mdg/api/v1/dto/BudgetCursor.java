package org.akashihi.mdg.api.v1.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

public record BudgetCursor (@JsonInclude(JsonInclude.Include.NON_NULL) Integer limit,
                            @JsonInclude(JsonInclude.Include.NON_NULL) Long pointer){}
