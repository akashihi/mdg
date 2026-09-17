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

data class TestNamed(val name: String?, val tags: List<String>?)

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class NulRejectingStringDeserializerTest {

    private val objectMapper = jacksonObjectMapper().registerModule(SimpleModule().addDeserializer(String::class.java, NulRejectingStringDeserializer()))

    @Test
    fun plainStringsAreAccepted() {
        val actual = objectMapper.readValue<TestNamed>("""{"name":"Wallet","tags":["food"]}""")
        actual shouldBe TestNamed("Wallet", listOf("food"))
    }

    @Test
    fun nullIsAccepted() {
        objectMapper.readValue<TestNamed>("""{"name":null}""") shouldBe TestNamed(null, null)
    }

    @Test
    fun nulInPropertyIsRejected() {
        // PostgreSQL refuses U+0000 in text, so it has to be stopped before the insert
        val e = assertThrows<JsonMappingException> { objectMapper.readValue<TestNamed>("""{"name":"a\u0000b"}""") }
        e.message shouldContain "NUL character is not allowed"
    }

    @Test
    fun nulInListElementIsRejected() {
        val e = assertThrows<JsonMappingException> { objectMapper.readValue<TestNamed>("""{"name":"Wallet","tags":["\u0000"]}""") }
        e.message shouldContain "NUL character is not allowed"
    }
}
