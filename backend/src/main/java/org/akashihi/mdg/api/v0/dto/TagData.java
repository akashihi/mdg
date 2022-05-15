package org.akashihi.mdg.api.v0.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TagData {
    private Long id;
    private String type;
    public record Attributes(String txtag) {}
    private Attributes attributes;
}
