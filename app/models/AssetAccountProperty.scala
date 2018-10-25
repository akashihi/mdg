package models

import controllers.api.IdentifiableObject.LongIdentifiable

/**
  * Entity for additional properties of accounts with type 'asset'
 *
  * @param operational 'operational' flag
  * @param favorite 'favorite' flag
  */
case class AssetAccountProperty(id: Option[Long],
                                operational: Boolean,
                                favorite: Boolean) extends LongIdentifiable
