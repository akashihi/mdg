package org.akashihi.mdg.dao

import org.akashihi.mdg.entity.Budget
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository
import java.time.LocalDate
import java.util.*

@Repository
interface BudgetRepository : JpaRepository<Budget, Long>, JpaSpecificationExecutor<Budget> {
    fun existsByEndGreaterThanEqualAndBeginningLessThanEqual(otherBeginning: LocalDate, otherEnd: LocalDate): Boolean
    fun existsByEndGreaterThanEqualAndBeginningLessThanEqualAndIdNot(otherBeginning: LocalDate, otherEnd: LocalDate, id: Long): Boolean
    fun findFirstByBeginningLessThanEqualAndEndGreaterThanEqual(beginning: LocalDate, end: LocalDate): Budget?
    fun findFirstByBeginningLessThanEqualOrderByBeginningDesc(beginning: LocalDate): Budget?
    fun findByEndGreaterThanEqualAndBeginningLessThanEqualOrderByBeginningAsc(from: LocalDate, to: LocalDate): Collection<Budget>
}
