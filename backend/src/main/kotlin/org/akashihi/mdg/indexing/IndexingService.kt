package org.akashihi.mdg.indexing

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import org.akashihi.mdg.dao.TransactionRepository
import org.akashihi.mdg.entity.Transaction
import org.springframework.data.elasticsearch.core.ElasticsearchOperations
import org.springframework.data.elasticsearch.core.SearchHit
import org.springframework.data.elasticsearch.core.query.Criteria
import org.springframework.data.elasticsearch.core.query.CriteriaQuery
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
open class IndexingService(private val elasticsearchOperations: ElasticsearchOperations, private val objectMapper: ObjectMapper, private val transactionRepository: TransactionRepository) {
    @Transactional(readOnly = true)
    open fun reIndex(language: String) {
        elasticsearchOperations.indexOps(TransactionDocument::class.java).delete()
        val settingsStream = IndexingService::class.java.classLoader.getResourceAsStream("elasticsearch/settings.$language.json")
        val typeRef = object : TypeReference<HashMap<String, Any>>() {}
        val settings: Map<String, Any> = objectMapper.readValue(settingsStream, typeRef)
        elasticsearchOperations.indexOps(TransactionDocument::class.java).create(settings)
        elasticsearchOperations.indexOps(TransactionDocument::class.java).putMapping(TransactionDocument::class.java)
        transactionRepository.streamAllBy().forEach { tx: Transaction? -> storeTransaction(tx) }
    }

    open fun storeTransaction(tx: Transaction?) {
        elasticsearchOperations.save(TransactionDocument.fromTx(tx!!))
    }

    open fun removeTransaction(id: Long) {
        elasticsearchOperations.delete(id.toString(), TransactionDocument::class.java)
    }

    open fun lookupByComment(comment: String): Collection<Long> {
        val q = CriteriaQuery(Criteria("comment").matches(comment))
        return elasticsearchOperations.search(q, TransactionDocument::class.java).stream().map { obj: SearchHit<TransactionDocument?> -> obj.id }
            .map { s: String -> s.toLong() }.toList()
    }

    open fun lookupByTag(tag: String): Collection<Long> {
        val q = CriteriaQuery(Criteria("tags").matches(tag))
        return elasticsearchOperations.search(q, TransactionDocument::class.java).stream().map { obj: SearchHit<TransactionDocument?> -> obj.id }
            .map { s: String -> s.toLong() }.toList()
    }
}
