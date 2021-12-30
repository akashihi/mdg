package org.akashihi.mdg.api.v0.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@Data
public class RateData {
    private Long id;
    private String type;
    public record Attributes(Long from_currency, Long to_currency, BigDecimal rate, LocalDateTime beginning, LocalDateTime end) {}
    private RateData.Attributes attributes;
}
