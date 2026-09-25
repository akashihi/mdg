package org.akashihi.mdg.api.util

import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.ObjectMapper
import org.akashihi.mdg.api.v1.MdgException
import org.springframework.stereotype.Service
import java.nio.charset.StandardCharsets
import java.util.*

@Service
open class CursorHelper(private val objectMapper: ObjectMapper) {
    fun <T> cursorFromString(cursor: String?, clazz: Class<T>?): T? {
        if (cursor.isNullOrEmpty()) {
            return null // No cursor at all, callers fall back to a fresh first page
        }
        return try {
            val cursorBytes = Base64.getUrlDecoder().decode(cursor)
            objectMapper.readValue(String(cursorBytes, StandardCharsets.UTF_8), clazz)
        } catch (e: IllegalArgumentException) {
            throw MdgException("CURSOR_DATA_INVALID", e) // Not a base64 string at all
        } catch (e: JsonProcessingException) {
            throw MdgException("CURSOR_DATA_INVALID", e)
        }
    }

    fun <T> cursorToString(cursor: T): String? {
        return try {
            val cursorString = objectMapper.writeValueAsString(cursor)
            Base64.getUrlEncoder().encodeToString(cursorString.toByteArray(StandardCharsets.UTF_8))
        } catch (e: JsonProcessingException) {
            null
        }
    }
}
