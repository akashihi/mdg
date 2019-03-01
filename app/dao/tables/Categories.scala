package dao.tables

import models.{AccountType, Category}
import slick.jdbc.PostgresProfile.api._
import slick.lifted._

class Categories(tag: Tag) extends Table[Category](tag, "category") {
  implicit val accountTypeMapper = Accounts.accountTypeMapper
  def id = column[Option[Long]]("id", O.PrimaryKey, O.AutoInc)
  def account_type = column[AccountType]("account_type")
  def name = column[String]("name")
  def priority = column[Int]("priority")
  def * = (id, account_type, name, priority) <> ((Category.apply _).tupled, Category.unapply)
}
