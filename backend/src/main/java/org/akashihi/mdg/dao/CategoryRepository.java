package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.AccountType;
import org.akashihi.mdg.entity.Category;
import org.akashihi.mdg.entity.CategoryTree;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByNameAndAccountType(String name, AccountType type);

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

    @Query("FROM Category WHERE id NOT IN (SELECT DISTINCT descendant FROM CategoryTree where depth >0) ORDER BY priority ASC")
    Collection<Category> findTopCategories();

    @Query("FROM CategoryTree WHERE descendant = ?2 and ancestor = ?1")
    Collection<CategoryTree> findInvertedParent(Long category, Long parent);

    @Modifying
    @Query(nativeQuery = true, value = "DELETE FROM category_tree WHERE descendant IN (SELECT descendant FROM category_tree WHERE ancestor = ?1) AND ancestor IN (SELECT ancestor FROM category_tree WHERE descendant = ?1 AND ancestor != descendant)")
    void removeParent(Long id);

    @Modifying
    @Query(nativeQuery = true, value = "INSERT INTO category_tree (ancestor, descendant, depth) SELECT supertree.ancestor, subtree.descendant, supertree.depth+subtree.depth+1 FROM category_tree AS supertree CROSS JOIN category_tree AS subtree WHERE subtree.ancestor = ?1 AND supertree.descendant = ?2")
    void adopt(Long id, Long parent);
}
