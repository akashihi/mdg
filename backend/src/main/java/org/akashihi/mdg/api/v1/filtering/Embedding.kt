package org.akashihi.mdg.api.v1.filtering;

import org.akashihi.mdg.entity.Account;
import org.akashihi.mdg.entity.BudgetEntry;
import org.akashihi.mdg.entity.Operation;

import java.util.Collection;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;

public final class Embedding {
    private Embedding() {}

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
            // In case a list of accounts is processed, blindly setting a currency id may cause an issue,
            // when same account is on the list for more than one time. As instance of the same account
            // is referenced multiple times, first visit to that reference will set categoryId and
            // remove category if requested. Next visit will assume, that category is still there
            // and it will cause NPE. To avoid such situations a simple check was added:
            // if currency id is set, we know, that accounts was already visited and there is no need
            // to reprocess.
            if (account.getCurrencyId() == null) {
                account.setCurrencyId(account.getCurrency().getId());
            }
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

    public static Function<BudgetEntry, BudgetEntry> embedBudgetEntryObject(Optional<Collection<String>> embed) {
        var accounts = embed.map(e-> e.contains("account")).orElse(false);
        var categories = embed.map(e -> e.contains("category")).orElse(false);

        return (entry) -> {
            var embeddedEntry = new BudgetEntry(entry);
            embeddedEntry.setAccountId(embeddedEntry.getAccount().getId());
            if (Objects.nonNull(embeddedEntry.getAccount().getCategory())) {
                embeddedEntry.setCategoryId(embeddedEntry.getAccount().getCategory().getId());
                if (categories) {
                    embeddedEntry.setCategory(embeddedEntry.getAccount().getCategory());
                }
            }
            if (!accounts) {
                embeddedEntry.setAccount(null);
            } else {
                embeddedEntry.setAccount(embedAccountObjects(embed).apply(embeddedEntry.getAccount()));
            }
            return embeddedEntry;
        };
    }
}
