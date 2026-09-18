package org.akashihi.mdg.api.v1.json

import com.fasterxml.jackson.databind.JsonMappingException
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.assertThrows
import java.time.LocalDate
import java.time.LocalDateTime

data class TestTermed(val beginning: LocalDate?, val ts: LocalDateTime?)

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class StrictTemporalDeserializersTest {

    private val objectMapper = jacksonObjectMapper().registerModule(
        SimpleModule()
            .addDeserializer(LocalDate::class.java, StrictLocalDateDeserializer())
            .addDeserializer(LocalDateTime::class.java, StrictLocalDateTimeDeserializer())
    )

    @Test
    fun isoStringsAreAccepted() {
        val actual = objectMapper.readValue<TestTermed>("""{"beginning":"2017-02-04","ts":"2017-02-04T16:45:36"}""")
        actual shouldBe TestTermed(LocalDate.of(2017, 2, 4), LocalDateTime.of(2017, 2, 4, 16, 45, 36))
    }

    @Test
    fun nullIsAccepted() {
        objectMapper.readValue<TestTermed>("""{"beginning":null,"ts":null}""") shouldBe TestTermed(null, null)
    }

    @Test
    fun integerIsNotADate() {
        // Jackson's own reader would have taken this as days since the epoch, making it 1851-12-16
        val e = assertThrows<JsonMappingException> { objectMapper.readValue<TestTermed>("""{"beginning":-43115}""") }
        e.message shouldContain "A date is expected as a string"
    }

    @Test
    fun arrayIsNotADate() {
        val e = assertThrows<JsonMappingException> { objectMapper.readValue<TestTermed>("""{"beginning":[1970,1,1]}""") }
        e.message shouldContain "A date is expected as a string"
    }

    @Test
    fun arrayIsNotADateTime() {
        val e = assertThrows<JsonMappingException> { objectMapper.readValue<TestTermed>("""{"ts":[2020,1,1,0,0]}""") }
        e.message shouldContain "A date-time is expected as a string"
    }

    @Test
    fun malformedStringIsStillRejectedByTheStockParser() {
        assertThrows<JsonMappingException> { objectMapper.readValue<TestTermed>("""{"beginning":"not-a-date"}""") }
        assertThrows<JsonMappingException> { objectMapper.readValue<TestTermed>("""{"ts":"2017-02-04T16:45:36+02:00"}""") }
    }

    @Test
    fun trailingZStillRoundTrips() {
        val actual = objectMapper.readValue<TestTermed>("""{"ts":"2017-02-04T16:45:36Z"}""")
        actual.ts shouldBe LocalDateTime.of(2017, 2, 4, 16, 45, 36)
    }
}
