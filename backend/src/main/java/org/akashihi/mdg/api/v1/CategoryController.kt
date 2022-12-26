package org.akashihi.mdg.api.v1

import org.akashihi.mdg.entity.Category
import org.akashihi.mdg.service.CategoryService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

data class Categories(val categories: Collection<Category>)
@RestController
open class CategoryController(private val categoryService: CategoryService) {
    @PostMapping(value = ["/categories"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody category: Category): Category = categoryService.create(category)

    @GetMapping(value = ["/categories"], produces = ["application/vnd.mdg+json;version=1"])
    fun list(): Categories = Categories(categoryService.list())

    @GetMapping(value = ["/categories/{id}"], produces = ["application/vnd.mdg+json;version=1"])
    operator fun get(@PathVariable("id") id: Long): Category = categoryService[id] ?: throw MdgException("CATEGORY_NOT_FOUND")

    @PutMapping(value = ["/categories/{id}"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun update(@PathVariable("id") id: Long, @RequestBody category: Category): Category = categoryService.update(id, category) ?: throw MdgException("CATEGORY_NOT_FOUND")

    @DeleteMapping("/categories/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable("id") id: Long) = categoryService.delete(id)
}