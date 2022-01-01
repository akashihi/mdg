package org.akashihi.mdg.api.v1;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.entity.Category;
import org.akashihi.mdg.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping(value = "/categories", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.CREATED)
    Category addCategory(@RequestBody Category category) {
        return categoryService.create(category);
    }

    /*@GetMapping(value = "/category{id}", produces = "application/vnd.mdg+json;version=1")
    Category get(@PathVariable("id") Long id) {
        return categoryService.get(id);
    }*/

}
