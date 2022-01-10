package org.akashihi.mdg.indexing;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.akashihi.mdg.dao.TransactionRepository;
import org.akashihi.mdg.entity.Transaction;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class IndexingService {
    private final ElasticsearchOperations elasticsearchOperations;
    private final ObjectMapper objectMapper;
    private final TransactionRepository transactionRepository;

    @SneakyThrows
    @Transactional(readOnly = true)
    public void reIndex() {
        elasticsearchOperations.indexOps(TransactionDocument.class).delete();

        var settingsStream = IndexingService.class.getClassLoader().getResourceAsStream("elasticsearch/settings.json");
        var settings = objectMapper.readValue(settingsStream, Map.class);

        elasticsearchOperations.indexOps(TransactionDocument.class).create(settings);
        elasticsearchOperations.indexOps(TransactionDocument.class).putMapping(TransactionDocument.class);

        transactionRepository.streamAllBy().forEach(this::storeTransaction);
    }

    public void storeTransaction(Transaction tx) {
        elasticsearchOperations.save(new TransactionDocument(tx));
    }

    public Collection<Long> lookupByComment(String comment) {
        var q = new CriteriaQuery(new Criteria("comment").matches(comment));
        return elasticsearchOperations.search(q, TransactionDocument.class).stream().map(SearchHit::getId).map(Long::parseLong).toList();
    }

    public Collection<Long> lookupByTag(String tag) {
        var q = new CriteriaQuery(new Criteria("tags").matches(tag));
        return elasticsearchOperations.search(q, TransactionDocument.class).stream().map(SearchHit::getId).map(Long::parseLong).toList();
    }
}
