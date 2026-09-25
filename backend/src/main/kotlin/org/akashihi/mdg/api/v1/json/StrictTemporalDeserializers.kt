package org.akashihi.mdg.api.v1.json

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.JsonToken
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.deser.std.StdScalarDeserializer
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer
import org.springframework.boot.jackson.JsonComponent
import java.io.IOException
import java.time.LocalDate
import java.time.LocalDateTime

@JsonComponent
open class StrictLocalDateDeserializer : StdScalarDeserializer<LocalDate>(LocalDate::class.java) {
    @Throws(IOException::class)
    override fun deserialize(jsonParser: JsonParser, deserializationContext: DeserializationContext): LocalDate {
        if (!jsonParser.hasToken(JsonToken.VALUE_STRING)) {
            return deserializationContext.reportInputMismatch(
                LocalDate::class.java,
                "A date is expected as a string, got %s",
                jsonParser.currentToken()
            )
        }
        return LocalDateDeserializer.INSTANCE.deserialize(jsonParser, deserializationContext)
    }
}

@JsonComponent
open class StrictLocalDateTimeDeserializer : StdScalarDeserializer<LocalDateTime>(LocalDateTime::class.java) {
    @Throws(IOException::class)
    override fun deserialize(jsonParser: JsonParser, deserializationContext: DeserializationContext): LocalDateTime {
        if (!jsonParser.hasToken(JsonToken.VALUE_STRING)) {
            return deserializationContext.reportInputMismatch(
                LocalDateTime::class.java,
                "A date-time is expected as a string, got %s",
                jsonParser.currentToken()
            )
        }
        return LocalDateTimeDeserializer.INSTANCE.deserialize(jsonParser, deserializationContext)
    }
}
