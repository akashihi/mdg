package org.akashihi.mdg.api.v0.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SettingData {
    private String id;
    private String type;
    public record Attributes(String value) {}
    private SettingData.Attributes attributes;
}
