package org.akashihi.mdg.entity

import org.akashihi.mdg.entity.CategoryTree.CategoryTreePK
import java.io.Serializable
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.IdClass
import javax.persistence.Table

@Entity
@Table(name = "category_tree")
@IdClass(CategoryTreePK::class)
class CategoryTree(
    @Id
    private val ancestor: Long? = null,

    @Id
    private val descendant: Long? = null,

    @Id
    private val depth: Int? = null
) {
    class CategoryTreePK : Serializable {
        private val ancestor: Long? = null
        private val descendant: Long? = null
        private val depth: Int? = null
    }
}
