package org.akashihi.mdg.api.v1.json;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import org.akashihi.mdg.entity.Tag;

import java.io.IOException;

public class TagDeserializer extends StdDeserializer<Tag> {
    protected TagDeserializer() {
        this(null);
    }

    protected TagDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public Tag deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException {
        var tagString = deserializationContext.readValue(jsonParser, String.class);
        return new Tag(tagString);
    }
}
