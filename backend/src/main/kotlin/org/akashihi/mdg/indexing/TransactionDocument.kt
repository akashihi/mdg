package org.akashihi.mdg.indexing

import org.akashihi.mdg.entity.Tag
import org.akashihi.mdg.entity.Transaction
import org.springframework.data.annotation.Id
import org.springframework.data.elasticsearch.annotations.Document
import org.springframework.data.elasticsearch.annotations.Field
import org.springframework.data.elasticsearch.annotations.FieldType

@Document(indexName = "mdg")
class TransactionDocument(tx: Transaction) {
    @Id
    private val id: Long

    @Field(name = "comment", type = FieldType.Text, analyzer = "comments")
    private val comment: String

    @Field(name = "tags", type = FieldType.Text, analyzer = "tags")
    private val tags: String

    init {
        id = tx.id!!
        tags = tx.tags.map(Tag::tag).joinToString(" ")
        comment = tx.comment ?: ""
    }
}
