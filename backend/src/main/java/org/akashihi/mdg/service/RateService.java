package org.akashihi.mdg.service;

import org.akashihi.mdg.dao.RateRepository;
import org.akashihi.mdg.entity.Rate;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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

    public LocalDateTime lastUpdate() {
        return rateRepository.findAll(PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, "from")))
                .stream()
                .map(Rate::getBeginning)
                .findFirst()
                .orElse(LocalDateTime.of(1, 1, 1, 0, 0, 0, 0));
    }
}
