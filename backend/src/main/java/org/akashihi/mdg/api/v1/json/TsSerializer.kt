package org.akashihi.mdg.api.v1.json

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.SerializerProvider
import com.fasterxml.jackson.databind.ser.std.StdSerializer
import java.io.IOException
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

open class TsSerializer protected constructor(t: Class<LocalDateTime>? = null) : StdSerializer<LocalDateTime>(t) {
    @Throws(IOException::class)
    override fun serialize(localDateTime: LocalDateTime, jsonGenerator: JsonGenerator, serializerProvider: SerializerProvider) {
        jsonGenerator.writeString(localDateTime.format(DateTimeFormatter.ISO_DATE_TIME) + "Z")
    }
}