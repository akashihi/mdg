package org.akashihi.mdg.api.v1.json

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.JsonToken
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.deser.std.StdScalarDeserializer
import com.fasterxml.jackson.databind.deser.std.StringDeserializer
import org.springframework.boot.jackson.JsonComponent
import java.io.IOException

// Jackson's own StringDeserializer ends with "if the token is any scalar, take its textual form", so
// a property the specification types as a string used to accept a number or a boolean and store the
// rendering: {"name": 42} created an account named "42". CoercionConfig cannot reach this on Jackson
// 2.13, where StringDeserializer never consults it, so the token is checked here instead.
//
// And PostgreSQL refuses U+0000 in text columns. Rejecting it while the body is read makes it a
// 400 REQUEST_BODY_INVALID instead of a 500 from the insert.
@JsonComponent
open class StrictStringDeserializer : StdScalarDeserializer<String>(String::class.java) {
    @Throws(IOException::class)
    override fun deserialize(jsonParser: JsonParser, deserializationContext: DeserializationContext): String {
        if (!jsonParser.hasToken(JsonToken.VALUE_STRING)) {
            return deserializationContext.reportInputMismatch(
                String::class.java,
                "A string is expected, got %s",
                jsonParser.currentToken()
            )
        }
        val value = StringDeserializer.instance.deserialize(jsonParser, deserializationContext)
        if (value.indexOf('\u0000') >= 0) {
            throw deserializationContext.weirdStringException(value, String::class.java, "NUL character is not allowed")
        }
        return value
    }
}
