package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Modifying
    @Query(nativeQuery = true, value = "INSERT INTO category_tree (ancestor, descendant, depth) SELECT t.ancestor, ?2, t.depth + 1 FROM category_tree AS t WHERE t.descendant = ?1 UNION ALL SELECT ?2, ?2, 0")
    void addLeaf(Long parent, Long leaf);

    @Modifying
    @Query(nativeQuery = true, value = "INSERT INTO category_tree (ancestor, descendant, depth) VALUES (?1, ?1, 0)")
    void addRoot(Long leaf);
}
