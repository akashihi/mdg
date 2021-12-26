package org.akashihi.mdg.service;

import org.akashihi.mdg.dao.CurrencyRepository;
import org.akashihi.mdg.entity.Currency;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.Optional;

@Service
public class CurrencyService {
    private final CurrencyRepository currencyRepository;

    public CurrencyService(CurrencyRepository currencyRepository) {
        this.currencyRepository = currencyRepository;
    }

    public Collection<Currency> list() {
        return currencyRepository.findAll(Sort.by("active").ascending().and(Sort.by("name").ascending()));
    }

    public Optional<Currency> get(Long id) {
        return currencyRepository.findById(id);
    }

    @Transactional
    public Optional<Currency> update(Long id, Currency currency) {
        var existing_currency = currencyRepository.findById(id);
        if (existing_currency.isPresent()) {
            var updated_currency = existing_currency.get();
            updated_currency.setActive(currency.getActive());
            currencyRepository.save(updated_currency);
            return Optional.of(updated_currency);
        }
        return Optional.empty();
    }}
