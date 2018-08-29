package dao.tables

import models.TxTag
import slick.jdbc.PostgresProfile.api._
import slick.lifted._

/**
  * Maps Tag entity to the SQL table.
  */
class Tags(tag: Tag) extends Table[TxTag](tag, "tag") {
  def id = column[Option[Long]]("id", O.PrimaryKey, O.AutoInc)
  def txtag = column[String]("tag")
  def * = (id, txtag) <> ((TxTag.apply _).tupled, TxTag.unapply)
}
