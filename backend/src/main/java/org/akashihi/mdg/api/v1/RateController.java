package org.akashihi.mdg.api.v1;

import lombok.RequiredArgsConstructor;
import org.akashihi.mdg.api.v1.dto.RateStatus;
import org.akashihi.mdg.api.v1.dto.Rates;
import org.akashihi.mdg.entity.Rate;
import org.akashihi.mdg.service.RateService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class RateController {
    private final RateService rateService;

    @GetMapping(value = "/rates/status", produces = "application/vnd.mdg+json;version=1")
    public RateStatus updateStatus() {
        return new RateStatus(rateService.lastUpdate());
    }

    @GetMapping(value = "/rates/{ts}", produces = "application/vnd.mdg+json;version=1")
    public Rates listForTs(@PathVariable("ts") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime ts) {
        return new Rates(rateService.listForTs(ts));
    }

    @GetMapping(value = "/rates/{ts}/{from}/{to}", produces = "application/vnd.mdg+json;version=1")
    public Rate pairForTs(@PathVariable("ts") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime ts, @PathVariable("from") Long from, @PathVariable("to") Long to) {
        return rateService.getPair(ts, from, to);
    }
}
