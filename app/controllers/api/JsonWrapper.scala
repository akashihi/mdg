package controllers.api

import controllers.dto.{BudgetDTO, BudgetEntryDTO, TransactionDto}
import models.{Account, Currency}
import play.api.libs.json._

/**
  * Common api object JSON wrapper
  * @param id object id
  * @param type object type name
  * @param attributes object data
  */
case class JsonDataWrapper(id: Long, `type`: String, attributes: ApiObject)
object JsonDataWrapper {
  def apply(o: ApiObject): JsonDataWrapper = new JsonDataWrapper(o.id.getOrElse(-1), typeName(o), o)

  /**
    * Maps object class to type name
    * @param x object to match
    * @return class name
    */
  def typeName(x: ApiObject): String = x match {
    case Currency(_, _, _) => "currency"
    case Account(_, _, _, _, _, _) => "account"
    case TransactionDto(_, _, _, _, _) => "transaction"
    case BudgetDTO(_, _, _, _, _) => "budget"
    case BudgetEntryDTO(_, _, _, _, _, _, _) => "budgetentry"
  }
}

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
    * Converts ApiObject to Json
    * @param x object to convert
    * @return JsValue
    */
  def wrapJson(x: ApiObject): JsValue = {
    Json.toJson(JsonWrapper(JsonDataWrapper(x)))
  }

  /**
    * Converts several ApiObjects to Json
    * * @param x objects to convert
    * @return JsValue
    */
  def wrapJson(x: Seq[ApiObject]): JsValue = {
    Json.toJson(JsonWrapperSeq(x.map(JsonDataWrapper.apply)))
  }
}
