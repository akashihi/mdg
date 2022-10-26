package org.akashihi.mdg.api.v1;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.util.CursorHelper;
import org.akashihi.mdg.api.v1.dto.TransactionCursor;
import org.akashihi.mdg.api.v1.dto.Transactions;
import org.akashihi.mdg.api.v1.filtering.Embedding;
import org.akashihi.mdg.api.util.FilterConverter;
import org.akashihi.mdg.entity.Transaction;
import org.akashihi.mdg.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.Collections;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class TransactionController {
    private final ObjectMapper objectMapper;
    private final TransactionService transactionService;
    private final CursorHelper cursorHelper;

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
        TransactionCursor txCursor = cursor.flatMap(o -> cursorHelper.cursorFromString(o, TransactionCursor.class)).orElse(buildCursor(query, sort, embed, limit, Optional.empty()));
        var listResult = transactionService.list(txCursor.filter(), txCursor.sort(), txCursor.limit(), txCursor.pointer());
        var transactions = listResult.items();
        var left = listResult.left();
        var operationEmbedded = Embedding.embedOperationObjects(Optional.of(txCursor.embed()));
        transactions.forEach(tx -> tx.setOperations(tx.getOperations().stream().peek(o -> {o.getAccount().setBalance(BigDecimal.ZERO); o.getAccount().setPrimaryBalance(BigDecimal.ZERO);}).map(operationEmbedded).toList()));

        String self = cursorHelper.cursorToString(txCursor).orElse("");
        String first = "";
        String next = "";
        if (limit.isPresent() || cursor.isPresent()) { //In both cases we are in paging mode, either for the first page or for the subsequent pages
            var firstCursor = new TransactionCursor(txCursor.filter(), txCursor.sort(), txCursor.embed(), txCursor.limit(), 0L);
            first = cursorHelper.cursorToString(firstCursor).orElse("");
            if (transactions.isEmpty() || left == 0 ) {
                next = ""; //We may have no items at all or no items left, so no need to find next cursor
            } else {
                var nextCursor = new TransactionCursor(txCursor.filter(), txCursor.sort(), txCursor.embed(), txCursor.limit(), transactions.get(transactions.size()-1).getId());
                next = cursorHelper.cursorToString(nextCursor).orElse("");
            }
        }
        return new Transactions(transactions, self, first, next, left);
    }

    @GetMapping(value = "/transactions/{id}", produces = "application/vnd.mdg+json;version=1")
    Transaction get(@PathVariable("id") Long id, @RequestParam("embed") Optional<Collection<String>> embed) {
        var tx = transactionService.get(id).orElseThrow(() -> new MdgException("TRANSACTION_NOT_FOUND"));
        var operationEmbedded = Embedding.embedOperationObjects(embed);
        tx.setOperations(tx.getOperations().stream().map(operationEmbedded).toList());
        return tx;
    }

    @PutMapping(value = "/transactions/{id}", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.ACCEPTED)
    Transaction update(@PathVariable("id") Long id, @RequestBody Transaction tx) {
        var newTx = transactionService.update(id, tx).orElseThrow(() -> new MdgException("TRANSACTION_NOT_FOUND"));
        var operationEmbedded = Embedding.embedOperationObjects(Optional.empty());
        newTx.setOperations(newTx.getOperations().stream().map(operationEmbedded).toList());
        return newTx;
    }

    @DeleteMapping("/transactions/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable("id") Long id) {
        transactionService.delete(id);
    }
}
