package org.akashihi.mdg.api.v0.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Collection;

@Data
@AllArgsConstructor
public class CategoryData {
    private Long id;
    private String type;
    public record Attributes(Long id, String account_type, String name, Integer priority, Long parent_id, Collection<Attributes> children) {}
    private CategoryData.Attributes attributes;
}
