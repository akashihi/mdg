package controllers.api

import controllers.dto.reporting.GenericReportDTO
import util.Default
import controllers.dto._
import models.{Currency, Error, Rate, Setting, TxTag}
import play.api.libs.json._

/**
  * Api error object array wrapper.
  * @param errors errors to be wrapped.
  */
case class ErrorWrapper(errors: Seq[Error])

/**
  * Common api object JSON wrapper
  * @param id object id
  * @param type object type name
  * @param attributes object data
  */
case class JsonDataWrapper[T](id: T,
                              `type`: String,
                              attributes: IdentifiableObject[T])
object JsonDataWrapper {
  def wrap[T](o: IdentifiableObject[T]): JsonDataWrapper[T] = {
    new JsonDataWrapper[T](o.id.getOrElse(Default.value[T]), typeName(o), o)
  }

  def apply[T](o: IdentifiableObject[T]): JsonDataWrapper[T] = wrap(o)

  /**
    * Maps object class to type name
    * @param x object to match
    * @return class name
    */
  def typeName[T >: ApiObject](x: T): String = x match {
    case _: Currency => "currency"
    case _: CategoryDTO => "category"
    case _: AccountDTO => "account"
    case _: TransactionDto => "transaction"
    case _: BudgetDTO => "budget"
    case _: BudgetEntryDTO => "budgetentry"
    case _: TxTag => "tag"
    case _: Setting => "setting"
    case _: Rate => "rate"
    case _: GenericReportDTO[_] => "report"
  }
}

/**
  * Single entry api object JSON wrapper
  * @param data api object
  */
case class JsonWrapper[T](data: JsonDataWrapper[T])

/**
  * Multiple entries api object json wrapper
  * @param data api objects
  */
case class JsonWrapperSeq[T](data: Seq[JsonDataWrapper[T]],
                             count: Option[Int] = None)

object JsonWrapper {

  /**
    * Json helpers
    */
  implicit def dataWrites[T]: Writes[JsonDataWrapper[T]] =
    (o: JsonDataWrapper[T]) => {
      val idWriter = o.id match {
        case l: Long   => (JsPath \ "id").write[Long].writes(l)
        case s: String => (JsPath \ "id").write[String].writes(s)
      }
      idWriter ++
        (JsPath \ "type").write[String].writes(o.`type`) ++
        (JsPath \ "attributes")
          .write[IdentifiableObject[T]]
          .writes(o.attributes)
    }
  implicit def wrapperWrites[T]: Writes[JsonWrapper[T]] =
    (o: JsonWrapper[T]) => {
      (JsPath \ "data").write[JsonDataWrapper[T]].writes(o.data)
    }
  implicit def wrapperSeqWrites[T]: Writes[JsonWrapperSeq[T]] =
    (o: JsonWrapperSeq[T]) => {
      o.count match {
        case None =>
          (JsPath \ "data").write[Seq[JsonDataWrapper[T]]].writes(o.data)
        case Some(count) =>
          (JsPath \ "data")
            .write[Seq[JsonDataWrapper[T]]]
            .writes(o.data) ++ (JsPath \ "count").write[Int].writes(count)
      }
    }
  implicit val errorWrapperWrites: OWrites[ErrorWrapper] = Json.writes[ErrorWrapper]

  /**
    * Converts ApiObject to Json
    * @param x object to convert
    * @return JsValue
    */
  def wrapJson[T](x: IdentifiableObject[T]): JsValue = {
    Json.toJson(JsonWrapper(JsonDataWrapper(x)))
  }

  /**
    * Converts several ApiObjects to Json
    * * @param x objects to convert
    * @return JsValue
    */
  def wrapJson[T](x: Seq[IdentifiableObject[T]],
                  count: Option[Int] = None): JsValue = {
    Json.toJson(JsonWrapperSeq(x.map(JsonDataWrapper.wrap), count))
  }

  /**
    * Converts Error to Json
    * @param x error to convert
    * @return JsValue
    */
  def wrapJson(x: Error): JsValue = {
    Json.toJson(ErrorWrapper(Seq(x)))
  }
}
