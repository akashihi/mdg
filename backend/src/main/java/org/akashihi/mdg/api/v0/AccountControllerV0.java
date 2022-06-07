package org.akashihi.mdg.api.v0;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v0.dto.AccountData;
import org.akashihi.mdg.api.v0.dto.DataPlural;
import org.akashihi.mdg.api.v0.dto.DataSingular;
import org.akashihi.mdg.api.v0.dto.RequestException;
import org.akashihi.mdg.api.v1.RestException;
import org.akashihi.mdg.entity.Account;
import org.akashihi.mdg.entity.AccountType;
import org.akashihi.mdg.service.AccountService;
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

import java.util.*;

@RestController
@RequiredArgsConstructor
public class AccountControllerV0 {
    private final AccountService accountService;
    private final ObjectMapper objectMapper;

    protected Account fromDto(DataSingular<AccountData> dto) {
        return new Account(dto.data().getId(),
                AccountType.from(dto.data().getAttributes().account_type().toUpperCase(Locale.US)),
                dto.data().getAttributes().name(),
                null,
                dto.data().getAttributes().currency_id(),
                null,
                dto.data().getAttributes().category_id(),
                null,
                null,
                dto.data().getAttributes().hidden(),
                dto.data().getAttributes().operational(),
                dto.data().getAttributes().favorite());
    }

    protected AccountData toDto(Account account) {
        Long categoryId = null;
        if (account.getCategory() != null) {
            categoryId = account.getCategory().getId();
        }
        return new AccountData(account.getId(),
                "account",
                new AccountData.Attributes(account.getAccountType().toString().toLowerCase(Locale.US),
                        account.getCurrency().getId(),
                        categoryId,
                        account.getName(),
                        account.getBalance(),
                        account.getPrimaryBalance(),
                        account.getHidden(),
                        account.getOperational(),
                        account.getFavorite()));
    }

    @PostMapping(value = "/api/account", consumes = {"application/vnd.mdg+json", "application/json"}, produces = "application/vnd.mdg+json")
    @ResponseStatus(HttpStatus.CREATED)
    DataSingular<AccountData> create(@RequestBody DataSingular<AccountData> account) {
        try {
            var newAccount = accountService.create(fromDto(account));
            return new DataSingular<>(toDto(newAccount));
        }catch (RestException ex) {
            throw new RequestException(ex.getStatus(), ex.getTitle(), ex);
        }
    }

    @GetMapping(value = "/api/account", produces = "application/vnd.mdg+json")
    DataPlural<AccountData> list(@RequestParam("filter") Optional<String> query) {
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

        var accounts = accountService.list(filter).stream().map(this::toDto).toList();
        return new DataPlural<>(accounts);
    }

    @GetMapping(value = "/api/account/{id}", produces = "application/vnd.mdg+json")
    DataSingular<AccountData> get(@PathVariable("id") Long id) {
        var account = accountService.get(id).orElseThrow(() -> new RequestException(404, "ACCOUNT_NOT_FOUND"));
        return new DataSingular<>(toDto(account));
    }

    @PutMapping(value = "/api/account/{id}", consumes = {"application/vnd.mdg+json", "application/json"}, produces = "application/vnd.mdg+json")
    @ResponseStatus(HttpStatus.ACCEPTED)
    DataSingular<AccountData> update(@PathVariable("id") Long id, @RequestBody DataSingular<AccountData> account) {
        try {
            var newAccount = accountService.update(id, fromDto(account)).orElseThrow(() -> new RestException("ACCOUNT_NOT_FOUND", 404, "/accounts/%d".formatted(id)));
            return new DataSingular<>(toDto(newAccount));
        } catch (RestException ex) {
            throw new RequestException(ex.getStatus(), ex.getTitle(), ex);
        }
    }

    @DeleteMapping("/api/account/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable("id") Long id) {
        accountService.delete(id);
    }

}
