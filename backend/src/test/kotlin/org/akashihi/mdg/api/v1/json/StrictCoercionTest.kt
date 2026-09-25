package org.akashihi.mdg.api.v1.json

import com.fasterxml.jackson.databind.JsonDeserializer
import com.fasterxml.jackson.databind.JsonMappingException
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.assertThrows
import java.math.BigDecimal

enum class TestKind { ASSET, EXPENSE }

data class TestPrimitive(val name: String, val priority: Int)

data class TestScalars(val id: Long?, val amount: BigDecimal?, val favorite: Boolean?, val kind: TestKind?, val priority: Int? = null)

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Suppress("UNCHECKED_CAST")
class StrictCoercionTest {

    private val objectMapper = jacksonObjectMapper()
        .also { applyStrictCoercions(it) }
        .registerModule(
            SimpleModule().also { module ->
                INTEGRAL_TYPES.forEach { module.addDeserializer(it as Class<Any>, strictIntegralDeserializerFor(it) as JsonDeserializer<Any>) }
            }
        )

    @Test
    fun scalarsOfTheRightTypeAreAccepted() {
        val actual = objectMapper.readValue<TestScalars>("""{"id":840,"amount":100,"favorite":true,"kind":"ASSET"}""")
        actual shouldBe TestScalars(840L, BigDecimal(100), true, TestKind.ASSET)
    }

    @Test
    fun fractionalAmountIsAccepted() {
        objectMapper.readValue<TestScalars>("""{"amount":10.25}""").amount shouldBe BigDecimal("10.25")
    }

    @Test
    fun stringIsNotAnInteger() {
        assertThrows<JsonMappingException> { objectMapper.readValue<TestScalars>("""{"id":"840"}""") }
    }

    @Test
    fun fractionalFloatIsNotAnInteger() {
        assertThrows<JsonMappingException> { objectMapper.readValue<TestScalars>("""{"id":840.5}""") }
        assertThrows<JsonMappingException> { objectMapper.readValue<TestScalars>("""{"priority":3.5}""") }
    }

    @Test
    fun absentPrimitiveIsRejected() {
        // A non-nullable Kotlin Int without a default is a primitive, and the Kotlin module resolves an
        // absent one through the same null provider as an explicit null. With nulls failing by default
        // that is a rejection, not Jackson's 0 - which suits every such property the specification has,
        // since each of them is required.
        assertThrows<JsonMappingException> { objectMapper.readValue<TestPrimitive>("""{"name":"x"}""") }
    }

    @Test
    fun wholeFloatIsAnInteger() {
        // JSON has one number type, so JSON Schema reads 840.0 as a valid "type: integer"
        objectMapper.readValue<TestScalars>("""{"id":840.0,"priority":3.0}""") shouldBe
            TestScalars(840L, null, null, null, 3)
    }

    @Test
    fun emptyStringIsNotAnInteger() {
        // It used to deserialize to null, which on category_id means "drop the category"
        assertThrows<JsonMappingException> { objectMapper.readValue<TestScalars>("""{"id":""}""") }
    }

    @Test
    fun stringIsNotAnAmount() {
        assertThrows<JsonMappingException> { objectMapper.readValue<TestScalars>("""{"amount":"100"}""") }
    }

    @Test
    fun stringIsNotABoolean() {
        assertThrows<JsonMappingException> { objectMapper.readValue<TestScalars>("""{"favorite":"true"}""") }
    }

    @Test
    fun integerIsNotABoolean() {
        assertThrows<JsonMappingException> { objectMapper.readValue<TestScalars>("""{"favorite":1}""") }
    }

    @Test
    fun integerIsNotAnEnumOrdinal() {
        assertThrows<JsonMappingException> { objectMapper.readValue<TestScalars>("""{"kind":0}""") }
    }
}
