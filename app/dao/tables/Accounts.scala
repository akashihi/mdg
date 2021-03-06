package dao.tables

import models.{Account, AccountType}
import slick.jdbc.PostgresProfile.api._
import slick.lifted._

/**
  * Maps Accounts entity to the SQL table.
  */
object Accounts {
  implicit val accountTypeMapper =
    MappedColumnType.base[AccountType, String](_.value, AccountType(_))
}

class Accounts(tag: Tag) extends Table[Account](tag, "account") {
  implicit val accountTypeMapper = Accounts.accountTypeMapper
  def id = column[Option[Long]]("id", O.PrimaryKey, O.AutoInc)
  def account_type = column[AccountType]("account_type")
  def currency_id = column[Long]("currency_id")
  def category_id = column[Option[Long]]("category_id")
  def name = column[String]("name")
  def balance = column[BigDecimal]("balance")
  def hidden = column[Boolean]("hidden")
  def * =
    (id,
     account_type,
     currency_id,
     category_id,
     name,
     balance,
     hidden) <> ((Account.apply _).tupled, Account.unapply)
}
