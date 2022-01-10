package org.akashihi.mdg.indexing;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.akashihi.mdg.dao.TransactionRepository;
import org.akashihi.mdg.entity.Transaction;
import org.akashihi.mdg.service.TransactionService;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
