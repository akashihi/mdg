package org.akashihi.mdg.api.v1;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v1.dto.Categories;
import org.akashihi.mdg.entity.Category;
import org.akashihi.mdg.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping(value = "/categories", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.CREATED)
    Category create(@RequestBody Category category) {
        return categoryService.create(category);
    }

    @GetMapping(value = "/categories", produces = "application/vnd.mdg+json;version=1")
    Categories list() {
        return new Categories(categoryService.list());
    }

    @GetMapping(value = "/categories/{id}", produces = "application/vnd.mdg+json;version=1")
    Category get(@PathVariable("id") Long id) {
        return categoryService.get(id).orElseThrow(() -> new MdgException("CATEGORY_NOT_FOUND"));
    }

    @PutMapping(value = "/categories/{id}", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.ACCEPTED)
    Category update(@PathVariable("id") Long id, @RequestBody Category category) {
        return categoryService.update(id, category).orElseThrow(() -> new MdgException("CATEGORY_NOT_FOUND"));
    }

    @DeleteMapping("/categories/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable("id") Long id) {
        categoryService.delete(id);
    }
}
