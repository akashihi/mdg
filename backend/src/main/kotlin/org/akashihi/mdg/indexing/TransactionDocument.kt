package org.akashihi.mdg.indexing

import org.akashihi.mdg.entity.Tag
import org.akashihi.mdg.entity.Transaction
import org.springframework.data.annotation.Id
import org.springframework.data.elasticsearch.annotations.Document
import org.springframework.data.elasticsearch.annotations.Field
import org.springframework.data.elasticsearch.annotations.FieldType

@Document(indexName = "mdg")
class TransactionDocument() {
    @Id
    private var id: Long? = null

    @Field(name = "comment", type = FieldType.Text, analyzer = "comments")
    private var comment: String? = null

    @Field(name = "tags", type = FieldType.Text, analyzer = "tags")
    private var tags: String? = null

    companion object {
        fun fromTx(tx: Transaction) : TransactionDocument {
            val td = TransactionDocument()
            td.id = tx.id!!
            td.tags = tx.tags.map(Tag::tag).joinToString(" ")
            td.comment = tx.comment ?: ""
            return td
        }
    }
}
