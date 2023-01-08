package org.akashihi.mdg.api.util

import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.ObjectMapper
import java.util.Collections
import kotlin.collections.HashMap

object FilterConverter {
    fun buildFilter(query: String?, objectMapper: ObjectMapper): Map<String, String> {
        return query?.let { s: String ->
            try {
                val queryMap = HashMap<String, String>()
                val parsedQuery = objectMapper.readValue(s, Map::class.java)
                parsedQuery
                    .keys.filter { it is String && parsedQuery[it] is String }
                    .forEach { queryMap[it as String] = parsedQuery[it] as String }
                return@let queryMap
            } catch (e: JsonProcessingException) {
                return@let Collections.emptyMap()
            }
        } ?: Collections.emptyMap()
    }
}
