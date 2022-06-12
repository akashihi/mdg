package org.akashihi.mdg.api.v0;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v0.dto.DataPlural;
import org.akashihi.mdg.api.v0.dto.DataSingular;
import org.akashihi.mdg.api.v0.dto.RequestException;
import org.akashihi.mdg.api.v0.dto.TransactionData;
import org.akashihi.mdg.api.v1.RestException;
import org.akashihi.mdg.entity.Operation;
import org.akashihi.mdg.entity.Tag;
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

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class TransactionControllerV0 {
    private final TransactionService transactionService;
    private final ObjectMapper objectMapper;

    protected Transaction fromDto(DataSingular<TransactionData> dto) {
        var ops = dto.data().getAttributes().operations().stream().map(o -> {
            var op = new Operation();
            op.setAccount_id(o.account_id());
            op.setAmount(o.amount());
            op.setRate(o.rate());
            return op;
        }).toList();
        var tags = dto.data().getAttributes().tags().stream().map(t -> {
            var tag = new Tag();
            tag.setTag(t);
            return tag;
        }).collect(Collectors.toSet());
        return new Transaction(dto.data().getId(), dto.data().getAttributes().comment(), dto.data().getAttributes().timestamp(), tags, ops);
    }

    protected TransactionData toDto(Transaction transaction) {
        var ops = transaction.getOperations().stream().map(o -> new TransactionData.Operations(o.getAccount().getId(), o.getAmount(), o.getRate())).toList();
        var tags = transaction.getTags().stream().map(Tag::getTag).toList();
        return new TransactionData(transaction.getId(),
                "transaction",
                new TransactionData.Attributes(transaction.getTs(),
                        transaction.getComment(),
                        tags,
                        ops));
    }

    @PostMapping(value = "/api/transaction", consumes = {"application/vnd.mdg+json", "application/json"}, produces = "application/vnd.mdg+json")
    @ResponseStatus(HttpStatus.CREATED)
    DataSingular<TransactionData> create(@RequestBody DataSingular<TransactionData> transaction) {
        try {
            var newTx = transactionService.create(fromDto(transaction));
            return new DataSingular<>(toDto(newTx));
        }catch (RestException ex) {
            throw new RequestException(ex.getStatus(), ex.getTitle(), ex);
        }
    }

    @GetMapping(value = "/api/transaction", produces = "application/vnd.mdg+json")
    DataPlural<TransactionData> list(@RequestParam("filter") Optional<String> query, @RequestParam("sort") Optional<String> sort, @RequestParam("notEarlier") Optional<String> notEarlier, @RequestParam("notLater") Optional<String> notLater) {
        Map<String, String> filter = query.map(s -> {
            try {
                var queryMap = new HashMap<String, String>();
                var parsedQuery = objectMapper.readValue(s, Map.class);
                parsedQuery
                        .keySet().stream().filter(k -> k instanceof String && parsedQuery.get(k) instanceof String)
                        .forEach(k -> queryMap.put((String) k, (String) parsedQuery.get(k)));
                return queryMap;
            } catch (JsonProcessingException e) {
                return new HashMap<String,String>();
            }
        }).orElse(new HashMap<String,String>());

        notEarlier.ifPresent(f -> filter.put("notEarlier", f));
        notLater.ifPresent(f -> filter.put("notLater", f));
        var transactions = transactionService.list(filter, Collections.singleton(sort.orElse("")), null, null).transactions().stream().map(this::toDto).toList();
        return new DataPlural<>(transactions, transactions.size());
    }

    @GetMapping(value = "/api/transaction/{id}", produces = "application/vnd.mdg+json")
    DataSingular<TransactionData> get(@PathVariable("id") Long id) {
        var tx = transactionService.get(id).orElseThrow(() -> new RequestException(404, "TRANSACTION_NOT_FOUND"));
        return new DataSingular<>(toDto(tx));
    }

    @PutMapping(value = "/api/transaction/{id}", consumes = {"application/vnd.mdg+json", "application/json"}, produces = "application/vnd.mdg+json")
    @ResponseStatus(HttpStatus.ACCEPTED)
    DataSingular<TransactionData> update(@PathVariable("id") Long id, @RequestBody DataSingular<TransactionData> transaction) {
        try {
            var newTransaction = transactionService.update(id, fromDto(transaction)).orElseThrow(() -> new RestException("TRANSACTION_NOT_FOUND", 404, "/transaction/%d".formatted(id)));
            return new DataSingular<>(toDto(newTransaction));
        } catch (RestException ex) {
            throw new RequestException(ex.getStatus(), ex.getTitle(), ex);
        }
    }

    @DeleteMapping("/api/transaction/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable("id") Long id) {
        transactionService.delete(id);
    }

}
