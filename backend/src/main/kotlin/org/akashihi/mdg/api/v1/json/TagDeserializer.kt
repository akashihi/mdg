package org.akashihi.mdg.api.v1.json

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import org.akashihi.mdg.entity.Tag
import java.io.IOException

open class TagDeserializer protected constructor(vc: Class<*>? = null) : StdDeserializer<Tag>(vc) {
    @Throws(IOException::class)
    override fun deserialize(jsonParser: JsonParser, deserializationContext: DeserializationContext): Tag {
        val tagString = deserializationContext.readValue(jsonParser, String::class.java)
        return Tag(tagString)
    }
}
