package org.akashihi.mdg.api.v1.filtering;

import org.akashihi.mdg.entity.Account;
import org.akashihi.mdg.entity.Operation;

import java.util.Collection;
import java.util.Optional;
import java.util.function.Function;

public class Embedding {
    public static Function<Operation, Operation> embedOperationObjects(Optional<Collection<String>> embed) {
        var accounts = embed.map(e-> e.contains("account")).orElse(false);
        return (operation) -> {
            operation.setAccount_id(operation.getAccount().getId());
            if (!accounts) {
                operation.setAccount(null);
            } else {
                operation.setAccount(embedAccountObjects(embed).apply(operation.getAccount()));
            }
            return operation;
        };
    }
    public static Function<Account, Account> embedAccountObjects(Optional<Collection<String>> embed) {
        var categories = embed.map(e -> e.contains("category")).orElse(false);
        var currencies = embed.map(e -> e.contains("currency")).orElse(false);

        return (account) -> {
            account.setCurrencyId(account.getCurrency().getId());
            if (!currencies) {
                account.setCurrency(null);
            }
            if (account.getCategory() != null) {
                account.setCategoryId(account.getCategory().getId());
                if (!categories) {
                    account.setCategory(null);
                }
            }
            return account;
        };
    }
}