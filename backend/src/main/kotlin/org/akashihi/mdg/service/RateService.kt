package org.akashihi.mdg.service

import com.jayway.jsonpath.JsonPath
import org.akashihi.mdg.dao.RateRepository
import org.akashihi.mdg.entity.Currency
import org.akashihi.mdg.entity.Rate
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.WebClientResponseException
import org.springframework.web.util.UriTemplate
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.*
import java.util.concurrent.TimeUnit
import javax.transaction.Transactional

@Service
open class RateService(private val currencyService: CurrencyService, private val rateRepository: RateRepository, private val settingService: SettingService) {
    open fun listForTs(dt: LocalDateTime): Collection<Rate> = rateRepository.findByBeginningLessThanEqualAndEndGreaterThanOrderByFromAscToAsc(dt, dt)

    open fun getPair(dt: LocalDateTime, from: Long, to: Long): Rate = rateRepository.findByBeginningLessThanEqualAndEndGreaterThanAndFromEqualsAndToEquals(dt, dt, from, to) ?: Rate(dt, dt, from, to, BigDecimal.ONE, -1L)

    open fun getPair(dt: LocalDateTime, from: Currency, to: Currency): Rate = this.getPair(dt, from.id ?: -1, to.id ?: -1)

    open fun getCurrentRateForPair(from: Currency, to: Currency): Rate = this.getPair(LocalDateTime.now(), from.id ?: -1, to.id ?: -1)

    open fun toCurrentDefaultCurrency(from: Currency, amount: BigDecimal): BigDecimal {
        val primaryCurrency = settingService.currentCurrencyPrimary() ?: return amount
        if (primaryCurrency == from) {
            return amount
        }
        val currentRate = getCurrentRateForPair(from, primaryCurrency)
        return amount.multiply(currentRate.rate)
    }

    open fun lastUpdate(): LocalDateTime {
        return rateRepository.findAll(PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, "beginning")))
            .filterNotNull()
            .map { it.beginning }
            .firstOrNull() ?: LocalDateTime.of(1, 1, 1, 0, 0, 0, 0)
    }

    @Scheduled(fixedRate = 12, timeUnit = TimeUnit.HOURS)
    @Transactional
    open fun updateRates() {
        val currencies = currencyService.listActive()
        currencies.flatMap {
            currencies
                .filter { other: Currency -> other != it }
                .map { j: Currency -> Pair(it, j) }
        }
            .forEach { updateRateForPair(it) }
    }

    private fun queryYf(from: String, to: String): BigDecimal? {
        val symbols = "${from}$to=X"
        val uriTemplate = UriTemplate(YF_URL)
        val uri = uriTemplate.expand(symbols)
        val client = WebClient.create()
        return try {
            val response = client.get().uri(uri).retrieve().toEntity(String::class.java).block()
            if (response != null && response.statusCode == HttpStatus.OK) {
                val rateValue = JsonPath.parse(response.body).read<Double>("$.spark.result[0].response[0].meta.regularMarketPrice")
                rateValue?.let { BigDecimal.valueOf(it) }
            }
            null
        } catch (ignored: WebClientResponseException.NotFound) {
            log.info("No direct rate for {}/{}", from, to)
            null
        }
    }

    private fun updateRateForPair(currencyPair: Pair<Currency, Currency>) {
        if (log.isInfoEnabled) {
            log.info("Updating pair {}/{}", currencyPair.first.code, currencyPair.second.code)
        }
        var rate = queryYf(currencyPair.first.code, currencyPair.second.code)
        if (rate == null) {
            // Try to find an exchange rate via base currency USD
            val toUsd = queryYf(currencyPair.first.code, "USD")
            val fromUsd = queryYf("USD", currencyPair.second.code)
            rate = toUsd?.let { fromUsd?.let { multiplicand: BigDecimal? -> it.multiply(multiplicand) } }
        }
        if (rate != null) {
            val firstCurrencyId = currencyPair.first.id ?: return
            val secondCurrencyId = currencyPair.second.id ?: return

            @Suppress("MagicNumber")
            val rateEntry = Rate(LocalDateTime.now(), LocalDateTime.now().plusHours(12), firstCurrencyId, secondCurrencyId, rate)
            val exterior = rateRepository.findByBeginningLessThanEqualAndEndGreaterThanAndFromEqualsAndToEquals(rateEntry.beginning, rateEntry.end, rateEntry.from, rateEntry.to)
            if (exterior == null) {
                if (log.isWarnEnabled) {
                    log.warn("Creating first ever rate for: {}/{}", currencyPair.first.code, currencyPair.second.code)
                }
                @Suppress("MagicNumber")
                rateEntry.beginning = LocalDateTime.of(1, 1, 1, 0, 0, 0)
                @Suppress("MagicNumber")
                rateEntry.end = LocalDateTime.of(9999, 12, 31, 23, 59, 59)
                rateRepository.save(rateEntry)
                return
            }
            // Need to update validity period of exterior
            val next = rateRepository.findByBeginningGreaterThanEqualAndFromEqualsAndToEquals(rateEntry.end, rateEntry.from, rateEntry.to)
            exterior.end = rateEntry.beginning
            rateRepository.save(exterior)
            if (next == null) {
                @Suppress("MagicNumber")
                rateEntry.end = LocalDateTime.of(9999, 12, 31, 23, 59, 59)
                rateRepository.save(rateEntry)
                return
            }
            next.beginning = rateEntry.end
            rateRepository.save(next)
            rateRepository.save(rateEntry)
        } else {
            if (log.isWarnEnabled) {
                log.warn("Unable to load rate for {}/{} pair", currencyPair.first.code, currencyPair.second.code)
            }
        }
    }

    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        @JvmStatic
        private val log = LoggerFactory.getLogger(javaClass.enclosingClass)
        private const val YF_URL = "https://query1.finance.yahoo.com/v7/finance/spark?range=1d&interval=60m&indicators=close&includeTimestamps=true&includePrePost=false&corsDomain=finance.yahoo.com&.tsrc=finance&symbols={symbols}"
    }
}
