package org.akashihi.mdg.api.v0.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BudgetData {
    private Long id;
    private String type;
    public record Attributes(String term_beginning, String term_end) {}
    private Attributes attributes;
}
