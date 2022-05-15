package org.akashihi.mdg.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

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
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Account account;
    @Transient
    private Long account_id;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Operation operation = (Operation) o;
        return id != null && Objects.equals(id, operation.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
