package org.akashihi.mdg.service;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v1.MdgException;
import org.akashihi.mdg.dao.AccountRepository;
import org.akashihi.mdg.dao.CategoryRepository;
import org.akashihi.mdg.entity.AccountType;
import org.akashihi.mdg.entity.Category;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;

    @Transactional
    public Category create(Category category) {
        if (category.getAccountType().equals(AccountType.ASSET)) {
            throw new MdgException("CATEGORY_INVALID_TYPE", 412, "/categories");
        }

        if (category.getParentId() != null) {
            var parentCategory = categoryRepository.findById(category.getParentId());
            if (parentCategory.isEmpty()) {
                throw new MdgException("CATEGORY_DATA_INVALID", 412, "/categories");
            }
            if (!parentCategory.get().getAccountType().equals(category.getAccountType())) {
                throw new MdgException("CATEGORY_INVALID_TYPE", 412, "/categories");
            }
            categoryRepository.save(category);
            categoryRepository.addLeaf(parentCategory.get().getId(), category.getId());
        } else {
            categoryRepository.save(category);
            categoryRepository.addRoot(category.getId());
        }

        return category;
    }

    @Transactional
    public Collection<Category> list() {
        var roots = categoryRepository.findTopCategories();
        roots.forEach(this::enrichWithChildren);
        roots.sort((l, r) -> {
                    if (l.getAccountType().equals(r.getAccountType())) {
                        return 0;
                    }
                    if (l.getAccountType().equals(AccountType.ASSET)) {
                        return -1;
                    } else if (r.getAccountType().equals(AccountType.ASSET)) {
                        return 1;
                    } else if (l.getAccountType().equals(AccountType.INCOME)) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
        );
        return roots;
    }

    @Transactional
    public Optional<Category> get(Long id) {
        var categoryValue = categoryRepository.findById(id);
        if (categoryValue.isEmpty()) {
            return categoryValue;
        }
        var category = categoryValue.get();
        var parent = categoryRepository.findCategoryParent(category.getId());
        parent.ifPresent(category::setParentId);

        return Optional.of(this.enrichWithChildren(category));
    }

    protected Category enrichWithChildren(Category category) {
        var children = categoryRepository.findDirectChildren(category.getId()).stream().map(this::enrichWithChildren).toList();
        children.forEach(c -> c.setParentId(category.getId()));
        category.setChildren(children);
        return category;
    }

    @Transactional
    public Optional<Category> update(Long id, Category newCategory) {
        var categoryValue = categoryRepository.findById(id);
        if (categoryValue.isEmpty()) {
            return categoryValue;
        }
        var category = categoryValue.get();
        category.setName(newCategory.getName());
        category.setPriority(newCategory.getPriority());

        if (newCategory.getParentId() != null) {
            var parentValue = categoryRepository.findById(newCategory.getParentId());
            if (parentValue.isEmpty() && !newCategory.getParentId().equals(id)) {
                throw new MdgException("CATEGORY_DATA_INVALID", 412, "/categories/%d".formatted(id));
            }
            if (parentValue.map(Category::getAccountType).map(c -> !c.equals(category.getAccountType())).orElse(false)) {
                throw new MdgException("CATEGORY_INVALID_TYPE", 412, "/categories/%d".formatted(id));
            }
            var nextParent = parentValue.map(Category::getId).orElse(newCategory.getParentId());
            if (!nextParent.equals(id)) {
                //Check tree for cycle
                if (!categoryRepository.findInvertedParent(category.getId(), nextParent).isEmpty()) {
                    throw new MdgException("CATEGORY_TREE_CYCLED", 412, "/categories/%d".formatted(id));
                }
            } else {
                nextParent = 0L; //Self parent means no parent
            }
            categoryRepository.removeParent(id);
            categoryRepository.adopt(id, nextParent);
            category.setParentId(nextParent);
        }
        categoryRepository.save(category);
        return Optional.of(category);
    }

    @Transactional
    public void delete(Long id) {
        var categoryValue = categoryRepository.findById(id);
        if (categoryValue.isPresent()) {
            var category = categoryValue.get();
            if (!category.getAccountType().equals(AccountType.ASSET)) { // Silently ignore deletion request for ASSET categories
                accountRepository.dropCategory(id);
                categoryRepository.deleteById(id);
            }
        }
    }
}
