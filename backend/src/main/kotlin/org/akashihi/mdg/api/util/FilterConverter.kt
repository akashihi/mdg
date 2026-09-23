package org.akashihi.mdg.api.util

import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.ObjectMapper
import java.util.Collections
import kotlin.collections.HashMap

object FilterConverter {
    fun buildFilter(query: String?, objectMapper: ObjectMapper): Map<String, String> {
        if (query == null) {
            return Collections.emptyMap()
        }
        val parsedQuery = try {
            objectMapper.readValue(query, Map::class.java)
        } catch (_: JsonProcessingException) {
            null
        } ?: return Collections.emptyMap()
        val queryMap = HashMap<String, String>()
        parsedQuery
            .keys.filter { it is String && parsedQuery[it] is String }
            .forEach { queryMap[it as String] = parsedQuery[it] as String }
        return queryMap
    }
}
