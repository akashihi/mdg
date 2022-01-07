package org.akashihi.mdg.api.v1;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v1.dto.TransactionCursor;
import org.akashihi.mdg.api.v1.dto.Transactions;
import org.akashihi.mdg.api.v1.filtering.Embedding;
import org.akashihi.mdg.api.v1.filtering.FilterConverter;
import org.akashihi.mdg.entity.Transaction;
import org.akashihi.mdg.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collection;
import java.util.Collections;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class TransactionController {
    private final ObjectMapper objectMapper;
    private final TransactionService transactionService;

    protected Optional<TransactionCursor> cursorFromString(String cursor) {
        var cursorBytes = Base64.getUrlDecoder().decode(cursor);
        var cursorString = new String(cursorBytes, StandardCharsets.UTF_8);
        try {
            return Optional.of(objectMapper.readValue(cursorString, TransactionCursor.class));
        } catch (JsonProcessingException e) {
            return Optional.empty();
        }
    }

    protected String cursorToString(TransactionCursor cursor) throws JsonProcessingException {
        var cursorString = objectMapper.writeValueAsString(cursor);
        return Base64.getUrlEncoder().encodeToString(cursorString.getBytes(StandardCharsets.UTF_8));
    }

    protected TransactionCursor buildCursor(Optional<String> query, Optional<Collection<String>> sort, Optional<Collection<String>> embed, Optional<Integer> limit, Optional<Long> pointer) {
        var filter = FilterConverter.buildFilter(query, objectMapper);
        return new TransactionCursor(filter.orElse(Collections.emptyMap()), sort.orElse(Collections.emptyList()), embed.orElse(Collections.emptyList()), limit.orElse(null), pointer.orElse(null));
    }

    @PostMapping(value = "/transactions", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.CREATED)
    Transaction create(@RequestBody Transaction tx) {
        var newTransaction = transactionService.create(tx);
        newTransaction.getOperations().forEach(o -> o.setAccount(null)); //No embedding on creation
        return newTransaction;
    }

    @GetMapping(value = "/transactions", produces = "application/vnd.mdg+json;version=1")
    Transactions list(@RequestParam("q") Optional<String> query, @RequestParam("sort") Optional<Collection<String>> sort, @RequestParam("embed") Optional<Collection<String>> embed, @RequestParam("limit") Optional<Integer> limit, @RequestParam("cursor") Optional<String> cursor) {
        TransactionCursor txCursor = cursor.flatMap(this::cursorFromString).orElse(buildCursor(query, sort, embed, limit, Optional.empty()));
        var transactions = transactionService.list(txCursor.filter(), txCursor.sort(), txCursor.Limit(), txCursor.pointer());
        var operationEmbedded = Embedding.embedOperationObjects(Optional.of(txCursor.embed()));
        transactions.forEach(tx -> tx.setOperations(tx.getOperations().stream().map(operationEmbedded).toList()));
        return new Transactions(transactions, "", "", "", 0L);
    }

}
