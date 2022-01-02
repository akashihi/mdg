package org.akashihi.mdg.service;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v1.RestException;
import org.akashihi.mdg.dao.AccountRepository;
import org.akashihi.mdg.dao.CategoryRepository;
import org.akashihi.mdg.dao.CurrencyRepository;
import org.akashihi.mdg.entity.Account;
import org.akashihi.mdg.entity.AccountType;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;

import static org.akashihi.mdg.dao.AccountSpecification.filteredAccount;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;
    private final CurrencyRepository currencyRepository;

    @Transactional
    public Account create(Account account) {
        if (!account.getAccountType().equals(AccountType.ASSET)) {
            if (account.getOperational() != null && account.getOperational()) {
                throw new RestException("ACCOUNT_DATA_INVALID", 412, "/accounts");
            }
            if (account.getFavorite() != null && account.getFavorite()) {
                throw new RestException("ACCOUNT_DATA_INVALID", 412, "/accounts");
            }
        }
        if (account.getAccountType().equals(AccountType.ASSET)) {
            if (account.getCategoryId() == null) { //Default category for asset accounts
                var defaultCategory = categoryRepository.findByNameAndAccountType("Current", AccountType.ASSET).orElseThrow(() ->new RestException("CATEGORY_NOT_FOUND", 404, "/accounts"));
                account.setCategory(defaultCategory);
                account.setCategoryId(defaultCategory.getId());
            }
        }
        var currency = currencyRepository.findById(account.getCurrencyId()).orElseThrow(() ->new RestException("CURRENCY_NOT_FOUND", 404, "/accounts"));
        account.setCurrency(currency);
        if (account.getCategoryId() != null) {
            var category = categoryRepository.findById(account.getCategoryId()).orElseThrow(() ->new RestException("CATEGORY_NOT_FOUND", 404, "/accounts"));
            if (!category.getAccountType().equals(account.getAccountType())) {
                throw new RestException("CATEGORY_INVALID_TYPE", 412, "/accounts");
            }
            account.setCategory(category);
        }
        account.setBalance(BigDecimal.ZERO); //Accounts are created with balance 0
        account.setHidden(false);
        accountRepository.save(account);
        return account;
    }

    @Transactional
    public Collection<Account> list(Optional<Map<String, String>> query) {
        var sort = Sort.by("accountType").ascending().and(Sort.by("name").ascending());
        if (query.isEmpty()) {
            return accountRepository.findAll(sort);
        }
        return accountRepository.findAll(filteredAccount(query.get()), sort);
    }
}
