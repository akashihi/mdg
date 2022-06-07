package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.Rate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Optional;

public interface RateRepository extends JpaRepository<Rate, Long> {
    Collection<Rate> findByBeginningLessThanEqualAndEndGreaterThanOrderByFromAscToAsc(LocalDateTime rateBeginning, LocalDateTime rateEnd);

    Optional<Rate> findByBeginningLessThanEqualAndEndGreaterThanAndFromEqualsAndToEquals(LocalDateTime rateBeginning, LocalDateTime rateEnd, Long fromId, Long toId);

    Optional<Rate> findByBeginningGreaterThanEqualAndFromEqualsAndToEquals(LocalDateTime rateBeginning, Long fromId, Long toId);
}
