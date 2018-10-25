package dao.tables

import models.AssetAccountProperty
import slick.jdbc.PostgresProfile.api._
import slick.lifted._

/**
  * Maps AssertAccountProperty entity to the SQL table.
  */
class AssetAccountProperties(tag: Tag) extends Table[AssetAccountProperty](tag, "ASSET_ACCOUNT_PROPERTIES") {
  def id = column[Option[Long]]("id", O.PrimaryKey, O.AutoInc)
  def operational = column[Boolean]("operational")
  def favorite = column[Boolean]("favorite")
  def * =
    (id,
      operational,
      favorite) <> ((AssetAccountProperty.apply _).tupled, AssetAccountProperty.unapply)
}
