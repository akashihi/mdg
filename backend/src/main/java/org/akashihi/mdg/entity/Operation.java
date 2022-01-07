package org.akashihi.mdg.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.math.BigDecimal;

@Getter
@Setter
@ToString
@Entity
public class Operation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id;
    @ManyToOne
    @JoinColumn(name="tx_id", nullable = false)
    @JsonIgnore
    private Transaction transaction;
    private BigDecimal rate;
    private BigDecimal amount;
    @ManyToOne
    @JoinColumn(name="account_id", nullable = false)
    private Account account;
    @Transient
    private Long account_id;
}
