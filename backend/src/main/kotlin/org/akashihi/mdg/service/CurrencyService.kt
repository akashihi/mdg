package org.akashihi.mdg.service

import org.akashihi.mdg.dao.CurrencyRepository
import org.akashihi.mdg.entity.Currency
import org.springframework.data.domain.Sort
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.*
import javax.transaction.Transactional

@Service
open class CurrencyService(private val currencyRepository: CurrencyRepository) {
    open fun list(): Collection<Currency> = currencyRepository.findAll(Sort.by("active").descending().and(Sort.by("name").ascending()))

    open fun listActive(): Collection<Currency> = currencyRepository.findAllByActiveTrueOrderByNameAsc()

    open operator fun get(id: Long): Currency? = currencyRepository.findByIdOrNull(id)

    @Transactional
    open fun update(id: Long, currency: Currency): Currency? {
        return currencyRepository.findByIdOrNull(id)?.let {
            it.active = currency.active
            currencyRepository.save(it)
            return it
        }
    }
}
