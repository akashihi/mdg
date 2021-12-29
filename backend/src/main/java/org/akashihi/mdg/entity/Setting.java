package org.akashihi.mdg.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Getter
@Setter
@ToString
@Entity
public class Setting {
    @Id
    @Column(name = "name")
    private String id;
    private String value;
}
