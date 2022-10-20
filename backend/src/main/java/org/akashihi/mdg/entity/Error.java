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
public class Error {
    @Id
    private String code;
    private Short status;
    private String title;
    private String detail;
}
