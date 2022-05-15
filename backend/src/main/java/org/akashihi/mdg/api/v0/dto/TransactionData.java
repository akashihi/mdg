package org.akashihi.mdg.api.v0.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;

@Data
@AllArgsConstructor
public class TransactionData {
    private Long id;
    private String type;
    public record Operations(Long account_id, BigDecimal amount, BigDecimal rate) {}
    public record Attributes(LocalDateTime timestamp, String comment, Collection<String> tags, Collection<Operations> operations) {}
    private Attributes attributes;
}
