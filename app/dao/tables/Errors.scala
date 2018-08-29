package dao.tables

import models.Error
import slick.jdbc.PostgresProfile.api._
import slick.lifted._

/**
  * Maps Error entity to the SQL table.
  */
class Errors(tag: Tag) extends Table[Error](tag, "error") {
  def code = column[String]("code", O.PrimaryKey)
  def status = column[String]("status")
  def title = column[String]("title")
  def detail = column[Option[String]]("detail")
  def * =
    (code, status, title, detail) <> ((Error.apply _).tupled, Error.unapply)
}
