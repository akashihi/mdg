package org.akashihi.mdg.api.v1;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v1.dto.Currencies;
import org.akashihi.mdg.entity.Currency;
import org.akashihi.mdg.service.CurrencyService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CurrencyController {
    private final CurrencyService currencyService;

    @GetMapping(value = "/currencies", produces = "application/vnd.mdg+json;version=1")
    Currencies list() {
        return new Currencies(currencyService.list());
    }

    @GetMapping(value = "/currencies/{id}", produces = "application/vnd.mdg+json;version=1")
    Currency get(@PathVariable("id") Long id) {
        return currencyService.get(id).orElseThrow(() -> new RestException("CURRENCY_NOT_FOUND", 404, "/currencies/%d".formatted(id)));
    }

    @PutMapping(value = "/currencies/{id}", consumes = "application/vnd.mdg+json;version=1", produces = "application/vnd.mdg+json;version=1")
    @ResponseStatus(HttpStatus.ACCEPTED)
    Currency update(@PathVariable("id") Long id, @RequestBody Currency currency) {
        return currencyService.update(id, currency).orElseThrow(() -> new RestException("CURRENCY_NOT_FOUND", 404, "/currencies/%d".formatted(id)));
    }
}
