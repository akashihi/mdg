package models

case class Category(id: Option[Long], account_type: AccountType, name: String, priority: Int)
