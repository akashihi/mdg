package org.akashihi.mdg.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.*;
import org.akashihi.mdg.dao.AccountTypeConverter;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Convert(converter = AccountTypeConverter.class)
    @JsonProperty("account_type")
    private AccountType accountType;
    private String name;
    @ManyToOne
    @JoinColumn(name="currency_id", nullable = false)
    private Currency currency;
    @Transient
    @JsonProperty("currency_id")
    private Long currencyId;
    @ManyToOne
    @JoinColumn(name="category_id")
    private Category category;
    @Transient
    @JsonProperty("category_id")
    private Long categoryId;
    @Transient
    private BigDecimal balance;
    @Transient
    @JsonProperty("primary_balance")
    private BigDecimal primaryBalance;
    private Boolean hidden;
    private Boolean operational;
    private Boolean favorite;
}
