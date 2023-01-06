package org.akashihi.mdg.dao

import org.akashihi.mdg.entity.AccountType
import org.akashihi.mdg.entity.Category
import org.akashihi.mdg.entity.CategoryTree
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import java.util.*

interface CategoryRepository : JpaRepository<Category?, Long?> {
    fun findByNameAndAccountType(name: String?, type: AccountType?): Category?

    @Modifying
    @Query(nativeQuery = true, value = "INSERT INTO category_tree (ancestor, descendant, depth) SELECT t.ancestor, ?2, t.depth + 1 FROM category_tree AS t WHERE t.descendant = ?1 UNION ALL SELECT ?2, ?2, 0")
    fun addLeaf(parent: Long, leaf: Long)

    @Modifying
    @Query(nativeQuery = true, value = "INSERT INTO category_tree (ancestor, descendant, depth) VALUES (?1, ?1, 0)")
    fun addRoot(leaf: Long)

    @Query("SELECT ancestor FROM CategoryTree where depth=1 and descendant=?1")
    fun findCategoryParent(id: Long): Long?

    @Query("FROM Category AS c JOIN CategoryTree AS ct ON c.id = ct.descendant WHERE ct.depth = 1 and ct.ancestor = ?1")
    fun findDirectChildren(id: Long): Collection<Category>

    @Query("FROM Category WHERE id NOT IN (SELECT DISTINCT descendant FROM CategoryTree where depth >0) ORDER BY priority ASC")
    fun findTopCategories(): List<Category>

    @Query("FROM CategoryTree WHERE descendant = ?2 and ancestor = ?1")
    fun findInvertedParent(category: Long?, parent: Long?): Collection<CategoryTree>

    @Modifying
    @Query(
        nativeQuery = true,
        value = "DELETE FROM category_tree WHERE descendant IN (SELECT descendant FROM category_tree WHERE ancestor = ?1) AND ancestor IN (SELECT ancestor FROM category_tree WHERE descendant = ?1 AND ancestor != descendant)"
    )
    fun removeParent(id: Long)

    @Modifying
    @Query(
        nativeQuery = true,
        value = "INSERT INTO category_tree (ancestor, descendant, depth) SELECT supertree.ancestor, subtree.descendant, supertree.depth+subtree.depth+1 FROM category_tree AS supertree CROSS JOIN category_tree AS subtree WHERE subtree.ancestor = ?1 AND supertree.descendant = ?2"
    )
    fun adopt(id: Long, parent: Long)
}
