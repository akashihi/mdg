package org.akashihi.mdg.service;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v1.RestException;
import org.akashihi.mdg.dao.*;
import org.akashihi.mdg.entity.Account;
import org.akashihi.mdg.entity.Operation;
import org.akashihi.mdg.entity.Tag;
import org.akashihi.mdg.entity.Transaction;
import org.akashihi.mdg.indexing.IndexingService;
import org.akashihi.mdg.indexing.TransactionDocument;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final TagRepository tagRepository;
    private final OperationRepository operationRepository;
    private final IndexingService indexingService;

    protected Transaction enrichOperations(Transaction tx) {
        //Drop empty operations
        tx.setOperations(tx.getOperations().stream().filter(o -> o.getAmount()!= null && !o.getAmount().equals(BigDecimal.ZERO)).toList());

        //Propagate accounts
        tx.getOperations().forEach(o -> {
            var account = accountRepository.findById(o.getAccount_id()).orElseThrow(() -> new RestException("ACCOUNT_NOT_FOUND", 404, "/transactions"));
            o.setAccount(account);
        });

        //Set default rate if not specified
        tx.getOperations().forEach(o -> {if (o.getRate() == null) { o.setRate(BigDecimal.ONE);}});

        return tx;
    }

    protected Transaction validateTransaction(Transaction tx) {
        //Validate transaction:
        // Check that operation list is not empty
        if (tx.getOperations().isEmpty()) {
            throw new RestException("TRANSACTION_EMPTY", 412, "/transactions");
        }
        // Check that no operation has rate set to 0
        if (tx.getOperations().stream().anyMatch(o -> BigDecimal.ZERO.equals(o.getRate()))) {
            throw new RestException("TRANSACTION_ZERO_RATE", 412, "/transactions");
        }
        // Check that at least one operation has default rate (no rate set or rate set to 1)
        if (tx.getOperations().stream().noneMatch(o -> o.getRate().equals(BigDecimal.ONE))) {
            throw new RestException("TRANSACTION_NO_DEFAULT_RATE", 412, "/transactions");
        }
        // Check that default rate is only used for one currency, even if it is set on multiple operations
        if (tx.getOperations().stream().filter(o -> BigDecimal.ONE.equals(o.getRate())).map(Operation::getAccount).map(Account::getCurrency).distinct().count()>1) {
            throw new RestException("TRANSACTION_AMBIGUOUS_RATE", 412, "/transactions");
        }

        // Check that transaction is balanced. Single currency transactions should be perfectly balanced
        // For multi currency transactions relatively small disbalance is allowed
        var multicurrency = tx.getOperations().stream().anyMatch(o -> o.getRate() != null);
        var balance = tx.getOperations().stream().map(o -> o.getAmount().multiply(o.getRate())).reduce(BigDecimal.ZERO, BigDecimal::add);
        if ((!balance.equals(BigDecimal.ZERO) && !multicurrency) || !(balance.compareTo(BigDecimal.ONE.negate()) > 0 && balance.compareTo(BigDecimal.ONE) < 0)) {
            throw new RestException("TRANSACTION_NOT_BALANCED", 412, "/transactions");
        }
        return tx;
    }

    protected Set<Tag> enrichTags(Collection<Tag> tags) {
        return tags.stream().map(t -> {
            var candidate = tagRepository.findByTag(t.getTag());
            if (candidate.isPresent()) {
                return candidate.get();
            } else {
                tagRepository.save(t);
                return t;
            }
        }).collect(Collectors.toUnmodifiableSet());
    }

    protected Transaction loadTags(Transaction tx) {
        var dbTags = enrichTags(tx.getTags());
        tx.setTags(dbTags);
        return tx;
    }

    @Transactional
    public Transaction create(Transaction tx) {
        tx = enrichOperations(tx);
        tx = validateTransaction(tx);
        tx = loadTags(tx);

        var savedTransaction = transactionRepository.save(tx);
        tx.getOperations().forEach(o -> {o.setTransaction(savedTransaction); operationRepository.save(o);});

        indexingService.storeTransaction(tx);

        return tx;
    }

    public record ListResult(List<Transaction> transactions, Long left) {}

    @Transactional
    public ListResult list(Map<String, String> filter, Collection<String> sort, Integer limit, Long pointer) {
        var spec = TransactionSpecification.filteredTransactions(filter, pointer);
        var sorting = Sort.by("ts").descending().and(Sort.by("id").ascending()); //Sort by id then timestamp by default
        if (sort.contains("-timestamp")) {
            //Reverse sort requested
            sorting = Sort.by("ts").ascending().and(Sort.by("id").ascending());
        }
        if (limit == null) {
            return new ListResult(transactionRepository.findAll(spec, sorting), 0L);
        } else {
            var pageLimit = PageRequest.of(0, limit, sorting);
            var page =  transactionRepository.findAll(spec, pageLimit);
            return new ListResult(page.getContent(), page.getTotalElements()-limit);
        }
    }

    @Transactional
    public Optional<Transaction> get(Long id) {
        return transactionRepository.findById(id);
    }

    @Transactional
    public Optional<Transaction> update(Long id, Transaction newTx) {
        var txValue = transactionRepository.findById(id);
        if (txValue.isEmpty()) {
            return txValue;
        }
        var tx = txValue.get();

        tx.setTs(newTx.getTs());
        tx.setComment(newTx.getComment());

        var newTxTagValues = newTx.getTags().stream().map(Tag::getTag).collect(Collectors.toUnmodifiableSet());
        var removedTags = tx.getTags().stream().filter(t -> !newTxTagValues.contains(t.getTag())).collect(Collectors.toUnmodifiableSet());
        tx.getTags().removeAll(removedTags);
        var oldTxTagValues = tx.getTags().stream().map(Tag::getTag).collect(Collectors.toUnmodifiableSet());
        var tagsToInsert = newTx.getTags().stream().filter(t -> !oldTxTagValues.contains(t.getTag())).collect(Collectors.toUnmodifiableSet());
        var newTxTags = enrichTags(tagsToInsert);
        tx.getTags().addAll(newTxTags);
        var savedTransaction = transactionRepository.save(tx);


        operationRepository.deleteAll(savedTransaction.getOperations());
        savedTransaction.getOperations().clear();

        savedTransaction.setOperations(newTx.getOperations());

        savedTransaction = enrichOperations(savedTransaction);
        var finalTx = validateTransaction(savedTransaction);

        finalTx.setOperations(finalTx.getOperations().stream().map(o -> {o.setTransaction(finalTx); operationRepository.save(o); return o;} ).toList());

        indexingService.storeTransaction(tx);

        return Optional.of(finalTx);
    }

    @Transactional
    public void delete(Long id) {
        operationRepository.deleteOperationsForTransaction(id);
        transactionRepository.deleteById(id);
    }
}
