package org.akashihi.mdg.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

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
}
