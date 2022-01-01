package org.akashihi.mdg.service;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v1.RestException;
import org.akashihi.mdg.dao.CategoryRepository;
import org.akashihi.mdg.entity.AccountType;
import org.akashihi.mdg.entity.Category;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional
    public Category create(Category category) {
        if (category.getAccountType().equals(AccountType.ASSET)) {
            throw new RestException("CATEGORY_INVALID_TYPE", 412, "/categories");
        }
        categoryRepository.save(category); //Well be rolled back on error

        if (category.getParentId() != null) {
            var parentCategory = categoryRepository.findById(category.getParentId());
            if (parentCategory.isEmpty()) {
                throw new RestException("CATEGORY_DATA_INVALID", 412, "/categories");
            }
            if (!parentCategory.get().getAccountType().equals(category.getAccountType())) {
                throw new RestException("CATEGORY_INVALID_TYPE", 412, "/categories");
            }
            categoryRepository.addLeaf(parentCategory.get().getId(), category.getId());
        } else {
            categoryRepository.addRoot(category.getId());
        }

        return category;
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
        category.setChildren(children);
        return category;
    }
}
