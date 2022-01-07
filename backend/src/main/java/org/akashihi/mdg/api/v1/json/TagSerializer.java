package org.akashihi.mdg.api.v1.json;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import org.akashihi.mdg.entity.Tag;

import java.io.IOException;

public class TagSerializer extends StdSerializer<Tag> {
    protected TagSerializer() {
        this(null);
    }

    protected TagSerializer(Class<Tag> t) {
        super(t);
    }

    @Override
    public void serialize(Tag tag, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeString(tag.getTag());
    }
}
