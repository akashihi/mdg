package org.akashihi.mdg.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Objects;

@Getter
@Setter
@ToString
@Entity
public class Currency {
    @Id
    private Long id;
    private String code;
    private String name;
    private Boolean active;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Currency currency = (Currency) o;
        return id != null && Objects.equals(id, currency.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
