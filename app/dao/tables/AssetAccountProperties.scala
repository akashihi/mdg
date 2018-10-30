package dao.tables

import models.{AssetAccountProperty, AssetType}
import slick.jdbc.PostgresProfile.api._
import slick.lifted._

/**
  * Maps AssertAccountProperty entity to the SQL table.
  */
class AssetAccountProperties(tag: Tag) extends Table[AssetAccountProperty](tag, "asset_account_properties") {
  implicit val assetTypeMapper =
    MappedColumnType.base[AssetType, String](_.value, AssetType(_))

  def id = column[Option[Long]]("id", O.PrimaryKey)
  def operational = column[Boolean]("operational")
  def favorite = column[Boolean]("favorite")
  def asset_type = column[AssetType]("asset_type")
  def * =
    (id,
      operational,
      favorite,
      asset_type) <> ((AssetAccountProperty.apply _).tupled, AssetAccountProperty.unapply)
}
