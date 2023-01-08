package org.akashihi.mdg.api.util

import com.fasterxml.jackson.databind.ObjectMapper
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.TestInstance
import java.util.Collections

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class FilterConverterTest {

    private val objectMapper : ObjectMapper = ObjectMapper()
    @Test
    fun buildFilterMissing() {
        val actual = FilterConverter.buildFilter(null, objectMapper)
        actual shouldBe Collections.emptyMap()
    }

    @Test
    fun buildFilterInvalidJson() {
        val actual = FilterConverter.buildFilter("fail", objectMapper)
        actual shouldBe Collections.emptyMap()
    }

    @Test
    fun buildFilterCorrect() {
        val actual = FilterConverter.buildFilter("{\"field\": \"value\", \"test\": \"pass\"}", objectMapper)
        actual["field"] shouldBe "value"
        actual["test"] shouldBe "pass"
    }

    @Test
    fun buildFilterNonString() {
        val actual = FilterConverter.buildFilter("{\"field\": 17, \"test\": \"pass\"}", objectMapper)
        actual["test"] shouldBe "pass"
        actual.containsKey("field") shouldBe false
    }
}
