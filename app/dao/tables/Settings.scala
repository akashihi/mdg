package dao.tables

import models.Setting
import slick.driver.PostgresDriver.api._
import slick.lifted._

/**
  * Maps Settings entity to the SQL table.
  */
class Settings(tag: Tag) extends Table[Setting](tag, "setting") {
  def id = column[Option[String]]("name", O.PrimaryKey)
  def value = column[String]("value")
  def * = (id, value) <> ((Setting.apply _).tupled, Setting.unapply)
}
