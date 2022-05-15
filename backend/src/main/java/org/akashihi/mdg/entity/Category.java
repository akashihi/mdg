package org.akashihi.mdg.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.akashihi.mdg.dao.AccountTypeConverter;

import javax.persistence.*;
import java.util.Collection;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Convert(converter = AccountTypeConverter.class)
    @JsonProperty("account_type")
    private AccountType accountType;
    private String name;
    private Integer priority;
    @Transient
    @JsonProperty("parent_id")
    private Long parentId;
    @Transient
    private Collection<Category> children;
}
