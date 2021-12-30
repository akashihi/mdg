package org.akashihi.mdg.service;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.akashihi.mdg.dao.RateRepository;
import org.akashihi.mdg.entity.Currency;
import org.akashihi.mdg.entity.Rate;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriTemplate;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class RateService {
    private final CurrencyService currencyService;
    private final RateRepository rateRepository;

    public RateService(CurrencyService currencyService, RateRepository rateRepository) {
        this.currencyService = currencyService;
        this.rateRepository = rateRepository;
    }

    public Collection<Rate> listForTs(LocalDateTime dt) {
        return rateRepository.findByBeginningLessThanEqualAndEndGreaterThanOrderByFromAscToAsc(dt, dt);
    }

    public Rate getPair(LocalDateTime dt, Long from, Long to) {
        return rateRepository.findByBeginningLessThanEqualAndEndGreaterThanAndFromEqualsAndToEquals(dt, dt, from, to)
                .orElse(new Rate(-1L, dt, dt, from, to, new BigDecimal(1)));
    }

    public LocalDateTime lastUpdate() {
        return rateRepository.findAll(PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, "beginning")))
                .stream()
                .map(Rate::getBeginning)
                .findFirst()
                .orElse(LocalDateTime.of(1, 1, 1, 0, 0, 0, 0));
    }

    @Scheduled(fixedRate = 12, timeUnit = TimeUnit.HOURS)
    @Transactional
    public void updateRates() {
        var currencies = currencyService.listActive();
        currencies.stream().flatMap(c -> currencies.stream().filter(j -> !j.equals(c)).map(j -> ImmutablePair.of(c, j))).forEach(this::updateRateForPair);
    }

    protected Optional<BigDecimal> queryYf(String from, String to) {
        var symbols = "%s%s=X".formatted(from, to);
        String YF_URL = "https://query1.finance.yahoo.com/v7/finance/spark?range=1d&interval=60m&indicators=close&includeTimestamps=true&includePrePost=false&corsDomain=finance.yahoo.com&.tsrc=finance&symbols={symbols}";
        var uriTemplate = new UriTemplate(YF_URL);
        var uri = uriTemplate.expand(symbols);
        var client = WebClient.create();
        var response = client.get().uri(uri).retrieve().toEntity(String.class).block();

        if (response != null && response.getStatusCode() == HttpStatus.OK) {
            Double rateValue = JsonPath.parse(response.getBody()).read("$.spark.result[0].response[0].meta.regularMarketPrice");
            if (rateValue != null) {
                return Optional.of(BigDecimal.valueOf(rateValue));
            }
        }
        return Optional.empty();
    }

    protected void updateRateForPair(ImmutablePair<Currency, Currency> currencyPair) {
        log.info("Updating pair {}/{}", currencyPair.left.getCode(), currencyPair.right.getCode());
        var rate = this.queryYf(currencyPair.left.getCode(), currencyPair.right.getCode());
        if (rate.isEmpty()) {
            //Try to find an exchange rate via base currency USD
            var toUsd = this.queryYf(currencyPair.left.getCode(), "USD");
            var fromUsd = this.queryYf("USD", currencyPair.right.getCode());
            rate = toUsd.flatMap(t -> fromUsd.map(t::multiply));
        }
        if (rate.isPresent()) {
            var rateEntry = new Rate();
            rateEntry.setBeginning(LocalDateTime.now());
            rateEntry.setEnd(rateEntry.getBeginning().plusHours(12));
            rateEntry.setFrom(currencyPair.left.getId());
            rateEntry.setTo(currencyPair.right.getId());
            rateEntry.setRate(rate.get());

            var exteriorRate = rateRepository.findByBeginningLessThanEqualAndEndGreaterThanAndFromEqualsAndToEquals(rateEntry.getBeginning(), rateEntry.getEnd(), rateEntry.getFrom(), rateEntry.getTo());
            if (exteriorRate.isEmpty()) {
                log.warn("Creating first ever rate for: {}/{}", currencyPair.left.getCode(), currencyPair.right.getCode());
                rateEntry.setBeginning(LocalDateTime.of(1,1, 1, 0, 0, 0));
                rateEntry.setEnd(LocalDateTime.of(9999,12, 31, 23, 59, 59));
                rateRepository.save(rateEntry);
                return;
            }
            //Need to update validity period of exterior
            var exterior = exteriorRate.get();
            var nextRate = rateRepository.findByBeginningGreaterThanEqualAndFromEqualsAndToEquals(rateEntry.getEnd(), rateEntry.getFrom(), rateEntry.getTo());
            exterior.setEnd(rateEntry.getBeginning());
            rateRepository.save(exterior);

            if (nextRate.isEmpty()) {
                rateEntry.setEnd(LocalDateTime.of(9999,12, 31, 23, 59, 59));
                rateRepository.save(rateEntry);
                return;
            }
            var next = nextRate.get();
            next.setBeginning(rateEntry.getEnd());
            rateRepository.save(next);
            rateRepository.save(rateEntry);
        } else {
            log.warn("Unable to load rate for {}/{} pair", currencyPair.left.getCode(), currencyPair.right.getCode());
        }
    }
}
