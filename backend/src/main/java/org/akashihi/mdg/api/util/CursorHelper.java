package org.akashihi.mdg.api.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CursorHelper {
    private final ObjectMapper objectMapper;

    public <T> Optional<T> cursorFromString(String cursor, Class<T> clazz) {
        var cursorBytes = Base64.getUrlDecoder().decode(cursor);
        var cursorString = new String(cursorBytes, StandardCharsets.UTF_8);
        try {
            return Optional.of(objectMapper.readValue(cursorString, clazz));
        } catch (JsonProcessingException e) {
            return Optional.empty();
        }
    }

    public <T> Optional<String> cursorToString(T cursor)  {
        try {
            String cursorString = objectMapper.writeValueAsString(cursor);
            return Optional.of(Base64.getUrlEncoder().encodeToString(cursorString.getBytes(StandardCharsets.UTF_8)));
        } catch (JsonProcessingException e) {
            return Optional.empty();
        }
    }
}
