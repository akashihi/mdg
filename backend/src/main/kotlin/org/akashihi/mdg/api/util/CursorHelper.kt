package org.akashihi.mdg.api.util

import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.stereotype.Service
import java.nio.charset.StandardCharsets
import java.util.*

@Service
open class CursorHelper(private val objectMapper: ObjectMapper) {
    fun <T> cursorFromString(cursor: String?, clazz: Class<T>?): T? {
        val cursorBytes = Base64.getUrlDecoder().decode(cursor)
        val cursorString = String(cursorBytes)
        return try {
            objectMapper.readValue(cursorString, clazz)
        } catch (e: JsonProcessingException) {
            null
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
