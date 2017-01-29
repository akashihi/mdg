package controllers

import models.{ApiObject, Currency}
import play.api.libs.json.Json

/**
  * Common api object JSON wrapper
  * @param id object id
  * @param type object type name
  * @param attributes object data
  */
case class JsonDataWrapper(id: Long, `type`: String, attributes: ApiObject)

/**
  * Single entry api object JSON wrapper
  * @param data api object
  */
case class JsonWrapper (data: JsonDataWrapper)

/**
  * Multiple entries api object json wrapper
  * @param data api objects
  */
case class JsonWrapperSeq (data: Seq[JsonDataWrapper])

object JsonWrapper {
  /**
    * Json helpers
    */
  implicit val dataWrites = Json.writes[JsonDataWrapper]
  implicit val wrapperWrites = Json.writes[JsonWrapper]
  implicit val wrapperSeqWrites = Json.writes[JsonWrapperSeq]

  /**
    * Converts ApiObject to JsonWrapper object
    * @param x object to convert
    * @return JsonWrapper
    */
  def wrapJson(x: ApiObject): JsonWrapper = {
    JsonWrapper(JsonDataWrapper(x.id, typeName(x), x))
  }

  /**
    * Converts several ApiObjects to JsonWrapper object
    * @param x objects to convert
    * @return JsonWrapper
    */
  def wrapJson(x: Seq[ApiObject]): JsonWrapperSeq = {
    JsonWrapperSeq(x.map(o => JsonDataWrapper(o.id, typeName(o), o)))
  }

  /**
    * Maps object class to type name
    * @param x object to match
    * @return class name
    */
  def typeName(x: ApiObject): String = x match {
    case Currency(_, _, _) => "currency"
  }

}
