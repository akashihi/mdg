package org.akashihi.mdg.dao;

import org.akashihi.mdg.entity.Rate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Optional;

public interface RateRepository extends JpaRepository<Rate, Long> {
    Collection<Rate> findByBeginningLessThanEqualAndEndGreaterThanOrderByFromAscToAsc(LocalDateTime rate_beginning, LocalDateTime rate_end);

    Optional<Rate> findByBeginningLessThanEqualAndEndGreaterThanAndFromEqualsAndToEquals(LocalDateTime rate_beginning, LocalDateTime rate_end, Long from_id, Long to_id);
}
