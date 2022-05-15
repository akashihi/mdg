package org.akashihi.mdg.entity;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Getter
@Setter
@ToString
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Setting {
    @Id
    @Column(name = "name")
    private String id;
    private String value;
}
