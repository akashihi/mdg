package org.akashihi.mdg.api.v0.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CurrencyData {
    private Long id;
    private String type;
    public record Attributes(String code, String name, Boolean active) {}
    private Attributes attributes;
}
