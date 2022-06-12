package org.akashihi.mdg.api.v0;

import org.akashihi.mdg.api.v0.dto.CurrencyData;
import org.akashihi.mdg.api.v0.dto.DataPlural;
import org.akashihi.mdg.api.v0.dto.DataSingular;
import org.akashihi.mdg.api.v0.dto.RequestException;
import org.akashihi.mdg.service.CurrencyService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CurrencyControllerV0 {
    private final CurrencyService currencyService;

    public CurrencyControllerV0(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }

    @GetMapping(value = "/api/currency", produces = "application/vnd.mdg+json")
    DataPlural<CurrencyData> list() {
        var currencies = currencyService.list().stream().map(currency -> new CurrencyData(currency.getId(), "currency", new CurrencyData.Attributes(currency.getCode(), currency.getName(), currency.getActive()))).toList();
        return new DataPlural<>(currencies);
    }

    @GetMapping(value = "/api/currency/{id}", produces = "application/vnd.mdg+json")
    DataSingular<CurrencyData> get(@PathVariable("id") Long id) {
        var currency = currencyService.get(id).orElseThrow(() -> new RequestException(404, "CURRENCY_NOT_FOUND"));
        var currencyDto = new CurrencyData(id, "currency", new CurrencyData.Attributes(currency.getCode(), currency.getName(), currency.getActive()));
        return new DataSingular<>(currencyDto);
    }

    @PutMapping(value = "/api/currency/{id}", consumes = "application/vnd.mdg+json", produces = "application/vnd.mdg+json")
    @ResponseStatus(HttpStatus.ACCEPTED)
    DataSingular<CurrencyData> update(@PathVariable("id") Long id, @RequestBody DataSingular<CurrencyData> currencyData) {
        var currency = currencyService.get(id).orElseThrow(() -> new RequestException(404, "CURRENCY_NOT_FOUND"));
        currency.setActive(currencyData.data().getAttributes().active());
        var updatedCurrency = currencyService.update(id, currency).orElseThrow(() -> new RequestException(404, "CURRENCY_NOT_FOUND"));
        var currencyDto = new CurrencyData(id, "currency", new CurrencyData.Attributes(updatedCurrency.getCode(), updatedCurrency.getName(), updatedCurrency.getActive()));
        return new DataSingular<>(currencyDto);
    }
}
