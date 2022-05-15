package org.akashihi.mdg.api.v0.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.akashihi.mdg.entity.AccountType;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class AccountData {
    private Long id;
    private String type;
    public record Attributes(String account_type, Long currency_id, Long category_id, String name, BigDecimal balance, BigDecimal primary_balance, Boolean hidden, Boolean operational, Boolean favorite) {}
    private Attributes attributes;
}
