package org.akashihi.mdg.service;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v1.RestException;
import org.akashihi.mdg.dao.AccountRepository;
import org.akashihi.mdg.dao.OperationRepository;
import org.akashihi.mdg.dao.TagRepository;
import org.akashihi.mdg.dao.TransactionRepository;
import org.akashihi.mdg.entity.Account;
import org.akashihi.mdg.entity.Operation;
import org.akashihi.mdg.entity.Transaction;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final TagRepository tagRepository;
    private final OperationRepository operationRepository;

    @Transactional
    public Transaction create(Transaction tx) {
        //Drop empty operations
        tx.setOperations(tx.getOperations().stream().filter(o -> !o.getAmount().equals(BigDecimal.ZERO)).toList());

        //Propagate accounts
        tx.getOperations().forEach(o -> {
            var account = accountRepository.findById(o.getAccount_id()).orElseThrow(() -> new RestException("ACCOUNT_NOT_FOUND", 404, "/transactions"));
            o.setAccount(account);
        });

        //Set default rate if not specified
        tx.getOperations().forEach(o -> {if (o.getRate() == null) { o.setRate(BigDecimal.ONE);}});

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

        // Load/Create tags
        var dbTags = tx.getTags().stream().map(t -> {
            var candidate = tagRepository.findByTag(t.getTag());
            if (candidate.isPresent()) {
                return candidate.get();
            } else {
                tagRepository.save(t);
                return t;
            }
        }).toList();
        tx.setTags(dbTags);

        transactionRepository.save(tx);
        tx.getOperations().forEach(o -> {o.setTransaction(tx); operationRepository.save(o);});
        return tx;
    }
}
