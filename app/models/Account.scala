package models

import controllers.api.IdentifiableObject
import play.api.libs.json._

/**
  * Account entity.
  */
sealed trait AccountType {
  def value: String
}

case object IncomeAccount extends AccountType {
  val value = "income"
}

case object AssetAccount extends AccountType {
  val value = "asset"
}

case object ExpenseAccount extends AccountType {
  val value = "expense"
}

case class Account(id: Option[Long],
                   account_type: AccountType,
                   currency_id: Long,
                   name: String,
                   balance: BigDecimal,
                   operational: Boolean,
                   favorite: Boolean,
                   hidden: Boolean)
    extends IdentifiableObject

object AccountType {
  def apply(arg: String): AccountType = arg match {
    case "income" => IncomeAccount
    case "asset" => AssetAccount
    case "expense" => ExpenseAccount
  }

  def unapply(arg: AccountType): Option[String] = Some(arg.value)
}

object Account {
  implicit val accountWrites = new Writes[Account] {
    override def writes(o: Account): JsValue = {
      Json.obj("name" -> o.name,
               "currency_id" -> o.currency_id,
               "balance" -> o.balance,
               "hidden" -> o.hidden,
               "account_type" -> o.account_type.value)
    }
  }
}
