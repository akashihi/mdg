package org.akashihi.mdg.api.v1.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Collection;
import java.util.Map;

public record TransactionCursor(
        @JsonInclude(JsonInclude.Include.NON_NULL) Map<String, String> filter,
        @JsonInclude(JsonInclude.Include.NON_NULL) Collection<String> sort,
        @JsonInclude(JsonInclude.Include.NON_NULL) Collection<String> embed,
        @JsonInclude(JsonInclude.Include.NON_NULL) Integer limit,
        @JsonInclude(JsonInclude.Include.NON_NULL) Long pointer) { }
