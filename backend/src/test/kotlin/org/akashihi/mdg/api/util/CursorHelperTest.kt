package org.akashihi.mdg.api.util

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.kotest.matchers.shouldBe
import org.akashihi.mdg.api.v1.MdgException
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.assertThrows

data class TestCursor(val limit: Int?, val pointer: Long?)

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class CursorHelperTest {

    private val cursorHelper = CursorHelper(jacksonObjectMapper())

    @Test
    fun cursorRoundTrips() {
        val encoded = cursorHelper.cursorToString(TestCursor(3, 7L))
        val actual = cursorHelper.cursorFromString(encoded, TestCursor::class.java)
        actual shouldBe TestCursor(3, 7L)
    }

    @Test
    fun missingCursorIsNoCursor() {
        cursorHelper.cursorFromString(null, TestCursor::class.java) shouldBe null
    }

    @Test
    fun emptyCursorIsNoCursor() {
        // The UI hands an exhausted `next` straight back, so this must not be an error
        cursorHelper.cursorFromString("", TestCursor::class.java) shouldBe null
    }

    @Test
    fun standardAlphabetIsRejected() {
        // `+` and `/` are not part of the url-safe alphabet the cursor is encoded with
        val e = assertThrows<MdgException> { cursorHelper.cursorFromString("a+b/c=", TestCursor::class.java) }
        e.code shouldBe "CURSOR_DATA_INVALID"
    }

    @Test
    fun truncatedCursorIsRejected() {
        val e = assertThrows<MdgException> { cursorHelper.cursorFromString("abcde", TestCursor::class.java) }
        e.code shouldBe "CURSOR_DATA_INVALID"
    }

    @Test
    fun undeserializableCursorIsRejected() {
        // Valid base64, but it decodes to `hello` rather than to a cursor
        val e = assertThrows<MdgException> { cursorHelper.cursorFromString("aGVsbG8=", TestCursor::class.java) }
        e.code shouldBe "CURSOR_DATA_INVALID"
    }
}
