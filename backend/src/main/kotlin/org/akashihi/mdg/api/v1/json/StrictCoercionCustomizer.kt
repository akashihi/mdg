package org.akashihi.mdg.api.v1.json

import com.fasterxml.jackson.annotation.JsonSetter
import com.fasterxml.jackson.annotation.Nulls
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.cfg.CoercionAction
import com.fasterxml.jackson.databind.cfg.CoercionInputShape
import com.fasterxml.jackson.databind.type.LogicalType
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer
import org.springframework.context.annotation.Configuration
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder

internal fun applyStrictCoercions(mapper: ObjectMapper) {
    mapper.coercionConfigFor(LogicalType.Integer)
        .setCoercion(CoercionInputShape.String, CoercionAction.Fail)
        .setCoercion(CoercionInputShape.EmptyString, CoercionAction.Fail)
        .setCoercion(CoercionInputShape.Boolean, CoercionAction.Fail)
    mapper.coercionConfigFor(LogicalType.Float)
        .setCoercion(CoercionInputShape.String, CoercionAction.Fail)
        .setCoercion(CoercionInputShape.EmptyString, CoercionAction.Fail)
        .setCoercion(CoercionInputShape.Boolean, CoercionAction.Fail)
    mapper.coercionConfigFor(LogicalType.Boolean)
        .setCoercion(CoercionInputShape.String, CoercionAction.Fail)
        .setCoercion(CoercionInputShape.EmptyString, CoercionAction.Fail)
        .setCoercion(CoercionInputShape.Integer, CoercionAction.Fail)
        .setCoercion(CoercionInputShape.Float, CoercionAction.Fail)
    mapper.coercionConfigFor(LogicalType.Enum)
        .setCoercion(CoercionInputShape.Integer, CoercionAction.Fail)
        .setCoercion(CoercionInputShape.EmptyString, CoercionAction.Fail)
    // The specification lets most optional properties be absent, but not null: {"id": null} is not an
    // integer. The Kotlin module hands both to a nullable parameter as null, and a primitive Int or
    // Boolean silently turns an explicit null into 0 or false, so an explicit null has to be refused
    // while the body is read. Properties the specification types as nullable opt back in with
    // @JsonSetter(nulls = Nulls.SET).
    mapper.setDefaultSetterInfo(JsonSetter.Value.forValueNulls(Nulls.FAIL))
}

@Configuration
open class StrictCoercionCustomizer : Jackson2ObjectMapperBuilderCustomizer {
    override fun customize(builder: Jackson2ObjectMapperBuilder) {
        builder.postConfigurer { applyStrictCoercions(it) }
        INTEGRAL_TYPES.forEach { builder.deserializerByType(it, strictIntegralDeserializerFor(it)) }
    }
}
