package models

import controllers.api.IdentifiableObject.LongIdentifiable
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
                   hidden: Boolean)
    extends LongIdentifiable

object AccountType {
  def apply(arg: String): AccountType = arg match {
    case "income" => IncomeAccount
    case "asset" => AssetAccount
    case "expense" => ExpenseAccount
  }

  def unapply(arg: AccountType): Option[String] = Some(arg.value)
}
