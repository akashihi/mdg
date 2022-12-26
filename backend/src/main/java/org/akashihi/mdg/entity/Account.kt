package org.akashihi.mdg.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.akashihi.mdg.dao.AccountTypeConverter;

import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Transient;
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
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Currency currency;
    @Transient
    @JsonProperty("currency_id")
    private Long currencyId;
    @ManyToOne
    @JoinColumn(name="category_id")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Category category;
    @Transient
    @JsonProperty("category_id")
    @JsonInclude(JsonInclude.Include.NON_NULL)
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
