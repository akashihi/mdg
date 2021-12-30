package org.akashihi.mdg.service;

import org.akashihi.mdg.dao.RateRepository;
import org.akashihi.mdg.entity.Rate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;

@Service
public class RateService {
    private final RateRepository rateRepository;

    public RateService(RateRepository rateRepository) {
        this.rateRepository = rateRepository;
    }

    public Collection<Rate> listForTs(LocalDateTime dt) {
        return rateRepository.findByBeginningLessThanEqualAndEndGreaterThanOrderByFromAscToAsc(dt, dt);
    }

    public Rate getPair(LocalDateTime dt, Long from, Long to) {
        return rateRepository.findByBeginningLessThanEqualAndEndGreaterThanAndFromEqualsAndToEquals(dt, dt, from, to)
                .orElse(new Rate(-1L, dt, dt, from, to, new BigDecimal(1)));
    }
}
