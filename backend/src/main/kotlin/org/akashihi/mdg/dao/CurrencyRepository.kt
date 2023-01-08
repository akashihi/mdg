package org.akashihi.mdg.dao

import org.akashihi.mdg.entity.Currency
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CurrencyRepository : JpaRepository<Currency, Long> {
    fun findAllByActiveTrueOrderByNameAsc(): Collection<Currency>
}
