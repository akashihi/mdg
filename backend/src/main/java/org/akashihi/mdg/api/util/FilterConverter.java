package org.akashihi.mdg.api.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public final class FilterConverter {
    private FilterConverter() {}

    public static Optional<Map<String, String>> buildFilter(Optional<String> query, ObjectMapper objectMapper) {
        return query.map(s -> {
            try {
                var queryMap = new HashMap<String,String>();
                var parsedQuery = objectMapper.readValue(s, Map.class);
                parsedQuery
                        .keySet().stream().filter(k -> k instanceof String && parsedQuery.get(k) instanceof String)
                        .forEach(k -> queryMap.put((String) k, (String) parsedQuery.get(k)));
                return queryMap;
            } catch (JsonProcessingException e) {
                return Collections.EMPTY_MAP;
            }
        });
    }
}
