package org.akashihi.mdg.api.v1.json

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.SerializerProvider
import com.fasterxml.jackson.databind.ser.std.StdSerializer
import org.akashihi.mdg.entity.Tag
import java.io.IOException

class TagSerializer protected constructor(t: Class<Tag?>? = null) : StdSerializer<Tag>(t) {
    @Throws(IOException::class)
    override fun serialize(tag: Tag, jsonGenerator: JsonGenerator, serializerProvider: SerializerProvider) {
        jsonGenerator.writeString(tag.tag)
    }
}