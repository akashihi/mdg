package org.akashihi.mdg.api.v0;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v0.dto.CategoryData;
import org.akashihi.mdg.api.v0.dto.DataPlural;
import org.akashihi.mdg.api.v0.dto.DataSingular;
import org.akashihi.mdg.api.v0.dto.RequestException;
import org.akashihi.mdg.api.v1.RestException;
import org.akashihi.mdg.entity.AccountType;
import org.akashihi.mdg.entity.Category;
import org.akashihi.mdg.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

@RestController
@RequiredArgsConstructor
public class CategoryControllerV0 {
    private final CategoryService categoryService;

    private Category fromDto(CategoryData data) {
        return new Category(data.getId(), AccountType.from(data.getAttributes().account_type().toUpperCase()), data.getAttributes().name(), data.getAttributes().priority(), data.getAttributes().parent_id(), Collections.EMPTY_LIST);
    }

    private CategoryData.Attributes toDto(Category category) {
        Collection<CategoryData.Attributes> children = new ArrayList<>();
        if (category.getChildren() != null) {
            children = category.getChildren().stream().map(this::toDto).toList();
        }
        return new CategoryData.Attributes(category.getId(), category.getAccountType().name().toLowerCase(), category.getName(), category.getPriority(), category.getParentId(), children);
    }

    @GetMapping(value = "/api/category", produces = "application/vnd.mdg+json")
    DataPlural<CategoryData> list() {
        return new DataPlural<>(categoryService.list().stream().map(c -> new CategoryData(c.getId(), "category", toDto(c))).toList());
    }

    @GetMapping(value = "/api/category/{id}", produces = "application/vnd.mdg+json")
    DataSingular<CategoryData> get(@PathVariable("id") Long id) {
        var category =  categoryService.get(id).orElseThrow(() -> new RestException("CATEGORY_NOT_FOUND", 404, "/categories/%d".formatted(id)));
        return new DataSingular<>(new CategoryData(category.getId(), "category", toDto(category)));
    }

    @PostMapping(value = "/api/category", consumes = {"application/vnd.mdg+json", "application/json"}, produces = "application/vnd.mdg+json")
    @ResponseStatus(HttpStatus.CREATED)
    DataSingular<CategoryData> addCategory(@RequestBody DataSingular<CategoryData> data) {
        try {
            var category= categoryService.create(fromDto(data.data()));
            return new DataSingular<>(new CategoryData(category.getId(), "category", toDto(category)));
        } catch (RestException ex) {
            throw new RequestException(ex.getStatus(), ex.getTitle());
        }
    }

    @PutMapping(value = "/api/category/{id}", consumes = {"application/vnd.mdg+json", "application/json"}, produces = "application/vnd.mdg+json")
    @ResponseStatus(HttpStatus.ACCEPTED)
    DataSingular<CategoryData> update(@PathVariable("id") Long id, @RequestBody DataSingular<CategoryData> data) {
        try {
            var category = categoryService.update(id, fromDto(data.data())).orElseThrow(() -> new RequestException(404, "CATEGORY_NOT_FOUND"));
            return new DataSingular<>(new CategoryData(category.getId(), "category", toDto(category)));
        } catch (RestException ex) {
            throw new RequestException(ex.getStatus(), ex.getTitle());
        }
    }

    @DeleteMapping(value = "/api/category/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable("id") Long id) {
        categoryService.delete(id);
    }

}
