package controllers.dto

import controllers.api.IdentifiableObject.LongIdentifiable
import models.AccountType
import play.api.libs.json._

case class AccountDTO(id: Option[Long],
                      account_type: AccountType,
                      currency_id: Long,
                      name: String,
                      balance: BigDecimal,
                      primary_balance: BigDecimal,
                      operational: Boolean,
                      favorite: Boolean,
                      hidden: Boolean
                     ) extends LongIdentifiable

object AccountDTO {
  implicit val accountDtoWrites = new Writes[AccountDTO] {
    override def writes(o: AccountDTO): JsValue = {
      Json.obj(
        "name" -> o.name,
        "currency_id" -> o.currency_id,
        "balance" -> o.balance,
        "primary_balance" -> o.primary_balance,
        "hidden" -> o.hidden,
        "account_type" -> o.account_type.value,
        "operational" -> o.operational,
        "favorite" -> o.favorite
      )
    }
  }
}
