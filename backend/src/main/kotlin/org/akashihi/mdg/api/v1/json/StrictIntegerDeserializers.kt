package org.akashihi.mdg.api.v1.json

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.JsonToken
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import com.fasterxml.jackson.databind.deser.std.DelegatingDeserializer
import com.fasterxml.jackson.databind.deser.std.NumberDeserializers
import java.io.IOException

open class StrictIntegralDeserializer(delegatee: JsonDeserializer<*>) : DelegatingDeserializer(delegatee) {
    override fun newDelegatingInstance(newDelegatee: JsonDeserializer<*>): JsonDeserializer<*> = StrictIntegralDeserializer(newDelegatee)

    @Throws(IOException::class)
    override fun deserialize(jsonParser: JsonParser, deserializationContext: DeserializationContext): Any {
        if (jsonParser.hasToken(JsonToken.VALUE_NUMBER_FLOAT) && jsonParser.decimalValue.stripTrailingZeros().scale() > 0) {
            return deserializationContext.reportInputMismatch(handledType(), "An integer is expected, got %s", jsonParser.text)
        }
        return super.deserialize(jsonParser, deserializationContext)
    }
}


internal val INTEGRAL_TYPES: List<Class<*>> = listOf(
    Long::class.javaObjectType,
    Long::class.javaPrimitiveType!!,
    Int::class.javaObjectType,
    Int::class.javaPrimitiveType!!
)

internal fun strictIntegralDeserializerFor(type: Class<*>): JsonDeserializer<*> =
    StrictIntegralDeserializer(NumberDeserializers.find(type, type.name)!!)
