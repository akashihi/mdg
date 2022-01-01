package org.akashihi.mdg.dao;

import liquibase.pro.packaged.Q;
import org.akashihi.mdg.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Modifying
    @Query(nativeQuery = true, value = "INSERT INTO category_tree (ancestor, descendant, depth) SELECT t.ancestor, ?2, t.depth + 1 FROM category_tree AS t WHERE t.descendant = ?1 UNION ALL SELECT ?2, ?2, 0")
    void addLeaf(Long parent, Long leaf);

    @Modifying
    @Query(nativeQuery = true, value = "INSERT INTO category_tree (ancestor, descendant, depth) VALUES (?1, ?1, 0)")
    void addRoot(Long leaf);

    @Query("SELECT ancestor FROM CategoryTree where depth=1 and descendant=?1")
    Optional<Long> findCategoryParent(Long id);

    @Query("FROM Category AS c JOIN CategoryTree AS ct ON c.id = ct.descendant WHERE ct.depth = 1 and ct.ancestor = ?1")
    Collection<Category> findDirectChildren(Long id);
}
