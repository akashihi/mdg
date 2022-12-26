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
import javax.persistence.Transient;
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
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long parentId;
    @Transient
    private Collection<Category> children;
}
