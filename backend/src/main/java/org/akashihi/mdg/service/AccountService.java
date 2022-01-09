package org.akashihi.mdg.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class AccountService {
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;
    private final CurrencyRepository currencyRepository;
    private final SettingService settingService;
    private final RateService rateService;

    protected Account setPrimaryBalance(Account a) {
        var defaultCurrency = settingService.getCurrentCurrencyPrimary();
        if (defaultCurrency.isEmpty() || a.getCurrency().equals(defaultCurrency.get())) {
            a.setPrimaryBalance(a.getBalance());
        } else {
            var rate = rateService.getCurrentRateForPair(a.getCurrency(), defaultCurrency.get());
            a.setPrimaryBalance(a.getBalance().multiply(rate.getRate()));
        }
        return a;
    }

    @Transactional
    public Account create(Account account) {
        if (!account.getAccountType().equals(AccountType.ASSET)) {
            if (account.getOperational() != null && account.getOperational()) {
                throw new RestException("ACCOUNT_NONASSET_INVALIDFLAG", 412, "/accounts");
            }
            if (account.getFavorite() != null && account.getFavorite()) {
                throw new RestException("ACCOUNT_NONASSET_INVALIDFLAG", 412, "/accounts");
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
        log.info("Created account {}", account);
        return account;
    }

    @Transactional
    public Collection<Account> list(Optional<Map<String, String>> query) {
        var sort = Sort.by("accountType").ascending().and(Sort.by("name").ascending());
        if (query.isEmpty()) {
            return accountRepository.findAll(sort).stream().map(this::setPrimaryBalance).toList();
        }
        return accountRepository.findAll(filteredAccount(query.get()), sort).stream().map(this::setPrimaryBalance).toList();
    }

    @Transactional
    public Optional<Account> get(Long id) {
        return accountRepository.findById(id).map(this::setPrimaryBalance);
    }

    @Transactional
    public Optional<Account> update(Long id, Account newAccount) {
        var accountValue = accountRepository.findById(id);
        if (accountValue.isEmpty()) {
            return accountValue;
        }

        var account = accountValue.get();
        if (newAccount.getHidden() != null) {
            account.setHidden(newAccount.getHidden());
        }
        if (newAccount.getName() != null) {
            account.setName(newAccount.getName());
        }
        if (newAccount.getCategoryId() == null) {
            account.setCategory(null);
        } else {
            Long currentCategoryId = null;
            if (account.getCategory() != null) {
                currentCategoryId = account.getCategory().getId();
            }
            if (!newAccount.getCategoryId().equals(currentCategoryId)) {
                var newCategory = categoryRepository.findById(newAccount.getCategoryId()).orElseThrow(() ->new RestException("CATEGORY_NOT_FOUND", 404, "/accounts/%d".formatted(id)));
                if (!newCategory.getAccountType().equals(account.getAccountType())) {
                    throw new RestException("CATEGORY_INVALID_TYPE", 412, "/accounts/%d".formatted(id));
                }
                account.setCategory(newCategory);
            }
        }

        if (account.getAccountType() == AccountType.ASSET) {
            account.setFavorite(newAccount.getFavorite());
            account.setOperational(newAccount.getOperational());
            if (!account.getCurrency().getId().equals(newAccount.getCurrencyId())) {
                throw new RestException("ACCOUNT_CURRENCY_ASSET", 422, "/accounts/%d".formatted(id));
            }
        } else {
            //TODO handle currency change
            if ((newAccount.getFavorite() != null && newAccount.getFavorite()) || (newAccount.getOperational() != null && newAccount.getOperational())) {
                throw new RestException("ACCOUNT_NONASSET_INVALIDFLAG", 412, "/accounts/%d".formatted(id));
            }
        }
        accountRepository.save(account);
        return Optional.of(setPrimaryBalance(account));
    }

    @Transactional
    public void delete(Long id) {
        var account = accountRepository.findById(id).orElseThrow(() -> new RestException("ACCOUNT_NOT_FOUND", 404, "/accounts/%d".formatted(id)));
        account.setHidden(true);
        accountRepository.save(account);
    }
}
