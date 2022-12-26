package org.akashihi.mdg.service

import org.akashihi.mdg.api.v1.MdgException
import org.akashihi.mdg.dao.AccountRepository
import org.akashihi.mdg.dao.CategoryRepository
import org.akashihi.mdg.entity.AccountType
import org.akashihi.mdg.entity.Category
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.*
import java.util.function.Consumer
import javax.transaction.Transactional

@Service
open class CategoryService(private val categoryRepository: CategoryRepository, private val accountRepository: AccountRepository) {
    @Transactional
    open fun create(category: Category): Category {
        if (category.accountType == AccountType.ASSET) {
            throw MdgException("CATEGORY_INVALID_TYPE")
        }
        if (category.parentId != null) {
            val parentCategory = categoryRepository.findByIdOrNull(category.parentId) ?: throw MdgException("CATEGORY_DATA_INVALID")
            if (parentCategory.accountType != category.accountType) {
                throw MdgException("CATEGORY_INVALID_TYPE")
            }
            categoryRepository.save(category)
            categoryRepository.addLeaf(parentCategory.id!!, category.id!!)
        } else {
            categoryRepository.save(category)
            categoryRepository.addRoot(category.id!!)
        }
        return category
    }

    @Transactional
    open fun list(): Collection<Category> {
        val roots = categoryRepository.findTopCategories()
        roots.forEach { enrichWithChildren(it) }
        roots.sortedWith { l: Category, r: Category ->
            if (l.accountType == r.accountType) {
                return@sortedWith 0
            }
            if (l.accountType == AccountType.ASSET) {
                return@sortedWith -1
            } else if (r.accountType == AccountType.ASSET) {
                return@sortedWith 1
            } else if (l.accountType == AccountType.INCOME) {
                return@sortedWith -1
            } else {
                return@sortedWith 1
            }
        }
        return roots
    }

    @Transactional
    open operator fun get(id: Long): Category? {
        val category = categoryRepository.findByIdOrNull(id) ?: return null
        val parent = categoryRepository.findCategoryParent(category.id!!)
        parent?.also { category.parentId = it }
        return enrichWithChildren(category)
    }

    protected open fun enrichWithChildren(category: Category): Category {
        val children = categoryRepository.findDirectChildren(category.id!!).map { enrichWithChildren(it) }
        children.forEach { it.parentId = category.id }
        category.children = children
        return category
    }

    @Transactional
    open fun update(id: Long, newCategory: Category): Category? {
        val category = categoryRepository.findByIdOrNull(id) ?: return null
        category.name = newCategory.name
        category.priority = newCategory.priority
        if (newCategory.parentId != null) {
            val parentValue = categoryRepository.findByIdOrNull(newCategory.parentId)
            if (parentValue == null && newCategory.parentId != id) {
                throw MdgException("CATEGORY_DATA_INVALID")
            }
            if (parentValue?.let(Category::accountType)?.let { it != category.accountType } == true) {
                throw MdgException("CATEGORY_INVALID_TYPE")
            }
            var nextParent = parentValue?.let(Category::id) ?: newCategory.parentId!!
            if (nextParent != id) {
                //Check tree for cycle
                if (!categoryRepository.findInvertedParent(category.id, nextParent).isEmpty()) {
                    throw MdgException("CATEGORY_TREE_CYCLED")
                }
            } else {
                nextParent = 0L //Self parent means no parent
            }
            categoryRepository.removeParent(id)
            categoryRepository.adopt(id, nextParent)
            category.parentId = nextParent
        }
        categoryRepository.save(category)
        return category
    }

    @Transactional
    open fun delete(id: Long) {
        val category = categoryRepository.findByIdOrNull(id) ?: return
        if (category.accountType != AccountType.ASSET) { // Silently ignore deletion request for ASSET categories
            accountRepository.dropCategory(id)
            categoryRepository.deleteById(id)
        }
    }
}