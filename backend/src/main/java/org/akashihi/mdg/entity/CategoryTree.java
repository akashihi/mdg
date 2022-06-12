package org.akashihi.mdg.entity;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Getter
@Setter
@ToString
@Table(name = "category_tree")
@IdClass(CategoryTree.CategoryTreePK.class)
public class CategoryTree {
    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    @EqualsAndHashCode
    static public class CategoryTreePK implements Serializable {
        private Long ancestor;
        private Long descendant;
        private Integer depth;
    }
    @Id
    private Long ancestor;
    @Id
    private Long descendant;
    @Id
    private Integer depth;
}
