package org.akashihi.mdg.api.v1

import org.akashihi.mdg.entity.Currency
import org.akashihi.mdg.service.CurrencyService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

data class Currencies(val currencies: Collection<Currency>)

@RestController
class CurrencyController(private val currencyService: CurrencyService) {
    @GetMapping(value = ["/currencies"], produces = ["application/vnd.mdg+json;version=1"])
    fun list(): Currencies = Currencies(currencyService.list())

    @GetMapping(value = ["/currencies/{id}"], produces = ["application/vnd.mdg+json;version=1"])
    operator fun get(@PathVariable("id") id: Long): Currency = currencyService[id] ?: throw MdgException("CURRENCY_NOT_FOUND")

    @PutMapping(value = ["/currencies/{id}"], consumes = ["application/vnd.mdg+json;version=1"], produces = ["application/vnd.mdg+json;version=1"])
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun update(@PathVariable("id") id: Long, @RequestBody currency: Currency): Currency = currencyService.update(id, currency) ?: throw MdgException("CURRENCY_NOT_FOUND")
}
