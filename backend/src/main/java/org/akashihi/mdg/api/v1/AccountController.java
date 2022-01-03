package org.akashihi.mdg.api.v1;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v1.dto.Accounts;
import org.akashihi.mdg.entity.Account;
import org.akashihi.mdg.service.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    private final ObjectMapper objectMapper;

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
        var embed_categories = embed.map(e -> e.contains("category")).orElse(false);
        var embed_currencies = embed.map(e -> e.contains("currency")).orElse(false);
        Optional<Map<String, String>> filter = query.map(s -> {
            try {
                var queryMap = new HashMap<String,String>();
                var parsedQuery = objectMapper.readValue(s, Map.class);
                parsedQuery
                        .keySet().stream().filter(k -> k instanceof String && parsedQuery.get(k) instanceof String)
                        .forEach(k -> queryMap.put((String) k, (String) parsedQuery.get(k)));
                return queryMap;
            } catch (JsonProcessingException e) {
                return Collections.EMPTY_MAP;
            }
        });

        var accounts = accountService.list(filter).stream().peek(a -> {
            a.setCurrencyId(a.getCurrency().getId());
            if (!embed_currencies) {
                a.setCurrency(null);
            }
            if (a.getCategory() != null) {
                a.setCategoryId(a.getCategory().getId());
                if (!embed_categories) {
                    a.setCategory(null);
                }
            }
        }).toList();
        return new Accounts(accounts);
    }

    @GetMapping(value = "/accounts/{id}", produces = "application/vnd.mdg+json;version=1")
    Account get(@PathVariable("id") Long id, @RequestParam("embed") Optional<Collection<String>> embed) {
        var embed_categories = embed.map(e -> e.contains("category")).orElse(false);
        var embed_currencies = embed.map(e -> e.contains("currency")).orElse(false);
        return accountService.get(id).map(a -> {
            a.setCurrencyId(a.getCurrency().getId());
            if (!embed_currencies) {
                a.setCurrency(null);
            }
            if (a.getCategory() != null) {
                a.setCategoryId(a.getCategory().getId());
                if (!embed_categories) {
                    a.setCategory(null);
                }
            }
            return a;
        }).orElseThrow(() -> new RestException("ACCOUNT_NOT_FOUND", 404, "/accounts/%d".formatted(id)));
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
