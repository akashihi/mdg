package org.akashihi.mdg.api.v0;

import org.akashihi.mdg.api.v0.dto.DataPlural;
import org.akashihi.mdg.api.v0.dto.DataSingular;
import org.akashihi.mdg.api.v0.dto.RateData;
import org.akashihi.mdg.service.RateService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
public class RateControllerV0 {
    private final RateService rateService;

    public RateControllerV0(RateService rateService) {
        this.rateService = rateService;
    }

    @GetMapping(value = "/api/rate/{ts}", produces = "application/vnd.mdg+json")
    public DataPlural<RateData> listForTs(@PathVariable("ts") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime ts) {
        return new DataPlural<>((rateService.listForTs(ts).stream().map(r -> new RateData(r.getId(), "rate", new RateData.Attributes(r.getFrom(), r.getTo(), r.getRate(), r.getBeginning(), r.getEnd()))).toList()));
    }

    @GetMapping(value = "/api/rate/{ts}/{from}/{to}", produces = "application/vnd.mdg+json")
    public DataSingular<RateData> pairForTs(@PathVariable("ts") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime ts, @PathVariable("from") Long from, @PathVariable("to") Long to) {
        var rate = rateService.getPair(ts, from, to);
        return new DataSingular<>(new RateData(rate.getId(), "rate", new RateData.Attributes(rate.getFrom(), rate.getTo(), rate.getRate(), rate.getBeginning(), rate.getEnd())));
    }

}
