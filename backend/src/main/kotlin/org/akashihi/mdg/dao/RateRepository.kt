package org.akashihi.mdg.dao

import org.akashihi.mdg.entity.Rate
import org.springframework.data.jpa.repository.JpaRepository
import java.time.LocalDateTime

interface RateRepository : JpaRepository<Rate?, Long?> {
    fun findByBeginningLessThanEqualAndEndGreaterThanOrderByFromAscToAsc(rateBeginning: LocalDateTime?, rateEnd: LocalDateTime?): Collection<Rate>
    fun findByBeginningLessThanEqualAndEndGreaterThanAndFromEqualsAndToEquals(rateBeginning: LocalDateTime?, rateEnd: LocalDateTime?, fromId: Long?, toId: Long?): Rate?
    fun findByBeginningGreaterThanEqualAndFromEqualsAndToEquals(rateBeginning: LocalDateTime?, fromId: Long?, toId: Long?): Rate?
}