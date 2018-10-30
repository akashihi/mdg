package controllers.dto

import controllers.api.IdentifiableObject.LongIdentifiable
import models.{AccountType, AssetType}
import play.api.libs.json._
import play.api.libs.functional.syntax._

case class AccountDTO(id: Option[Long],
                      account_type: AccountType,
                      asset_type: Option[AssetType],
                      currency_id: Long,
                      name: String,
                      balance: BigDecimal,
                      primary_balance: BigDecimal,
                      operational: Boolean,
                      favorite: Boolean,
                      hidden: Boolean
                     ) extends LongIdentifiable

object AccountDTO {
  implicit val accountDtoRead: Reads[AccountDTO] = (
    (JsPath \ "data" \ "attributes" \ "id").readNullable[Long] and
      (JsPath \ "data" \ "attributes" \ "account_type").read[String].map(AccountType.apply) and
      (JsPath \ "data" \ "attributes" \ "asset_type").readNullable[String].map(_.map(AssetType.apply)) and
      (JsPath \ "data" \ "attributes" \ "currency_id").read[Long] and
      (JsPath \ "data" \ "attributes" \ "name").read[String] and
      (JsPath \ "data" \ "attributes" \ "balance").readWithDefault[BigDecimal](0) and
      (JsPath \ "data" \ "attributes" \ "balance").readWithDefault[BigDecimal](0) and // Just to fill primary_balance
      (JsPath \ "data" \ "attributes" \ "operational").readWithDefault[Boolean](false) and
      (JsPath \ "data" \ "attributes" \ "favorite").readWithDefault[Boolean](false) and
      (JsPath \ "data" \ "attributes" \ "hidden").readWithDefault(false)
  )(AccountDTO.apply _)

  implicit val accountDtoWrites = new Writes[AccountDTO] {
    override def writes(o: AccountDTO): JsValue = {
      val j = Json.obj(
        "name" -> o.name,
        "currency_id" -> o.currency_id,
        "balance" -> o.balance,
        "primary_balance" -> o.primary_balance,
        "hidden" -> o.hidden,
        "account_type" -> o.account_type.value,
        "operational" -> o.operational,
        "favorite" -> o.favorite
      )
      if (o.asset_type.isDefined) {
        j ++ Json.obj("asset_type" -> o.asset_type.map(_.value))
      } else {
        j
      }
    }
  }
}
