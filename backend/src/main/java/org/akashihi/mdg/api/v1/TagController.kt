package org.akashihi.mdg.api.v1

import org.akashihi.mdg.entity.Tag
import org.akashihi.mdg.service.TransactionService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

data class Tags(val tags: Collection<Tag>)

@RestController
class TagController(private val transactionService: TransactionService) {
    @GetMapping(value = ["/tags"], produces = ["application/vnd.mdg+json;version=1"])
    fun list(): Tags = Tags(transactionService.listTags())
}
