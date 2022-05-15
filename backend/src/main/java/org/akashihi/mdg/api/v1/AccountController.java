package org.akashihi.mdg.api.v1;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v1.dto.Accounts;
import org.akashihi.mdg.api.v1.dto.CategoryTree;
import org.akashihi.mdg.api.v1.dto.CategoryTreeEntry;
import org.akashihi.mdg.api.v1.filtering.Embedding;
import org.akashihi.mdg.api.v1.filtering.FilterConverter;
import org.akashihi.mdg.entity.Account;
import org.akashihi.mdg.entity.AccountType;
import org.akashihi.mdg.entity.Category;
import org.akashihi.mdg.service.AccountService;
import org.akashihi.mdg.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.function.Function;

@RestController
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    private final CategoryService categoryService;
    private final ObjectMapper objectMapper;

    protected CategoryTreeEntry convertTopCategory(AccountType accountType, Collection<Category> categories, Collection<Account> accounts) {
        var topAccounts = accounts.stream().filter(a -> a.getAccountType().equals(accountType)).filter(a -> a.getCategoryId() == null).toList();
        var topCategories = categories.stream().filter(a -> a.getAccountType().equals(accountType)).map(c -> convertCategory(c, accounts)).filter(Optional::isPresent).map(Optional::get).toList();
        return new CategoryTreeEntry(null, null, topAccounts, topCategories);
    }

    protected Optional<CategoryTreeEntry> convertCategory(Category category, Collection<Account> accounts) {
        var categoryAccounts = accounts.stream().filter(a -> a.getCategoryId() != null).filter(a -> a.getCategoryId().equals(category.getId())).toList();
        var subCategories = category.getChildren().stream().map(c -> convertCategory(c, accounts)).filter(Optional::isPresent).map(Optional::get).toList();
        if (categoryAccounts.isEmpty() && subCategories.isEmpty()) {
            return Optional.empty();
        } else {
            return Optional.of(new CategoryTreeEntry(category.getId(), category.getName(), categoryAccounts, subCategories));
        }
    }

    @PostMapping(value = "/accounts", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.CREATED)
    Account create(@RequestBody Account account) {
        var newAccount = accountService.create(account);
        newAccount.setCategory(null); //Do not embed on creation
        newAccount.setCurrency(null);
        return newAccount;
    }

    @GetMapping(value = "/accounts", produces = "application/vnd.mdg+json;version=1")
    Accounts list(@RequestParam("q") Optional<String> query, @RequestParam("embed") Optional<Collection<String>> embed) {
        var accounts = accountService.list(FilterConverter.buildFilter(query, objectMapper)).stream().map(Embedding.embedAccountObjects(embed)).toList();
        return new Accounts(accounts);
    }

    @GetMapping(value = "/accounts/tree", produces = "application/vnd.mdg+json;version=1")
    CategoryTree tree(@RequestParam("q") Optional<String> query, @RequestParam("embed") Optional<Collection<String>> embed) {
        var categories = categoryService.list();
        var accounts = accountService.list(FilterConverter.buildFilter(query, objectMapper)).stream().map(Embedding.embedAccountObjects(embed)).toList();
        var assetEntry = convertTopCategory(AccountType.ASSET, categories, accounts);
        var expenseEntry = convertTopCategory(AccountType.EXPENSE, categories, accounts);
        var incomeEntry = convertTopCategory(AccountType.INCOME, categories, accounts);
        return new CategoryTree(assetEntry, expenseEntry, incomeEntry);
    }

    @GetMapping(value = "/accounts/{id}", produces = "application/vnd.mdg+json;version=1")
    Account get(@PathVariable("id") Long id, @RequestParam("embed") Optional<Collection<String>> embed) {
        return accountService.get(id).map(Embedding.embedAccountObjects(embed)).orElseThrow(() -> new RestException("ACCOUNT_NOT_FOUND", 404, "/accounts/%d".formatted(id)));
    }

    @PutMapping(value = "/accounts/{id}", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.ACCEPTED)
    Account update(@PathVariable("id") Long id, @RequestBody Account account) {
        var newAccount = accountService.update(id, account).orElseThrow(() -> new RestException("ACCOUNT_NOT_FOUND", 404, "/accounts/%d".formatted(id)));
        newAccount.setCurrencyId(newAccount.getCurrency().getId());
        if (newAccount.getCategory() != null) {
            newAccount.setCategoryId(newAccount.getCategory().getId());
        }
        return newAccount;
    }

    @DeleteMapping(value = "/accounts/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable("id") Long id) {
        accountService.delete(id);
    }
}
