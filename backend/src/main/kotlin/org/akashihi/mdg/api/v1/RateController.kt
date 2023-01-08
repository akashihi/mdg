package org.akashihi.mdg.api.v1

import org.akashihi.mdg.entity.Rate
import org.akashihi.mdg.service.RateService
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime

data class RateStatus(val dt: LocalDateTime)
data class Rates(val rates: Collection<Rate>)

@RestController
class RateController(private val rateService: RateService) {
    @GetMapping(value = ["/rates/status"], produces = ["application/vnd.mdg+json;version=1"])
    fun updateStatus(): RateStatus = RateStatus(rateService.lastUpdate())

    @GetMapping(value = ["/rates/{ts}"], produces = ["application/vnd.mdg+json;version=1"])
    fun listForTs(
        @PathVariable("ts")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        ts: LocalDateTime
    ): Rates = Rates(rateService.listForTs(ts))

    @GetMapping(value = ["/rates/{ts}/{from}/{to}"], produces = ["application/vnd.mdg+json;version=1"])
    fun pairForTs(
        @PathVariable("ts")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        ts: LocalDateTime,
        @PathVariable("from") from: Long,
        @PathVariable("to") to: Long
    ): Rate = rateService.getPair(ts, from, to)
}
