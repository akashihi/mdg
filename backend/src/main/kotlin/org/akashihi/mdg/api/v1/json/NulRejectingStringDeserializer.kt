package org.akashihi.mdg.api.v1.json

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.deser.std.StdScalarDeserializer
import com.fasterxml.jackson.databind.deser.std.StringDeserializer
import org.springframework.boot.jackson.JsonComponent
import java.io.IOException

// PostgreSQL refuses U+0000 in text columns. Rejecting it while the body is read makes it a
// 400 REQUEST_BODY_INVALID instead of a 500 from the insert.
@JsonComponent
open class NulRejectingStringDeserializer : StdScalarDeserializer<String>(String::class.java) {
    @Throws(IOException::class)
    override fun deserialize(jsonParser: JsonParser, deserializationContext: DeserializationContext): String {
        val value = StringDeserializer.instance.deserialize(jsonParser, deserializationContext)
        if (value.indexOf('\u0000') >= 0) {
            throw deserializationContext.weirdStringException(value, String::class.java, "NUL character is not allowed")
        }
        return value
    }
}
