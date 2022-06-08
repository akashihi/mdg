package org.akashihi.mdg.entity;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;

import javax.persistence.Entity;
import javax.persistence.Id;

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
    @SuppressFBWarnings(value = "BC_EQUALS_METHOD_SHOULD_WORK_FOR_ALL_OBJECTS", justification = "Checked with Hibernate.getClass()")
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) {
            return false;
        }
        Currency currency = (Currency) o;
        return id != null && id.equals(currency.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
