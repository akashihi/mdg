package dao.tables

import models.{Account, AccountType}
import slick.jdbc.PostgresProfile.api._
import slick.lifted._

/**
  * Maps Accounts entity to the SQL table.
  */
class Accounts(tag: Tag) extends Table[Account](tag, "account") {
  implicit val accountTypeMapper =
    MappedColumnType.base[AccountType, String](_.value, AccountType(_))

  def id = column[Option[Long]]("id", O.PrimaryKey, O.AutoInc)
  def account_type = column[AccountType]("account_type")
  def currency_id = column[Long]("currency_id")
  def name = column[String]("name")
  def balance = column[BigDecimal]("balance")
  def operational = column[Boolean]("operational")
  def favorite = column[Boolean]("favorite")
  def hidden = column[Boolean]("hidden")
  def * =
    (id,
     account_type,
     currency_id,
     name,
     balance,
     operational,
     favorite,
     hidden) <> ((Account.apply _).tupled, Account.unapply)
}