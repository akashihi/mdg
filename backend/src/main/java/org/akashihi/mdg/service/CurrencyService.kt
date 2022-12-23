package org.akashihi.mdg.service;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.dao.CurrencyRepository;
import org.akashihi.mdg.entity.Currency;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CurrencyService {
    private final CurrencyRepository currencyRepository;

    public Collection<Currency> list() {
        return currencyRepository.findAll(Sort.by("active").descending().and(Sort.by("name").ascending()));
    }

    public Collection<Currency> listActive() {
        return currencyRepository.findAllByActiveTrueOrderByNameAsc();
    }

    public Optional<Currency> get(Long id) {
        return currencyRepository.findById(id);
    }

    @Transactional
    public Optional<Currency> update(Long id, Currency currency) {
        var existingCurrency = currencyRepository.findById(id);
        if (existingCurrency.isPresent()) {
            var updatedCurrency = existingCurrency.get();
            updatedCurrency.setActive(currency.getActive());
            currencyRepository.save(updatedCurrency);
            return Optional.of(updatedCurrency);
        }
        return Optional.empty();
    }}
