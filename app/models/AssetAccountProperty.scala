package models

import controllers.api.IdentifiableObject.LongIdentifiable

/**
  * Asset type definition.
  */
sealed trait AssetType {
  def value: String
}

case object CashAssetAccount extends AssetType {
  val value = "cash"
}

case object CurrentAssetAccount extends AssetType {
  val value = "current"
}

case object SavingsAssetAccount extends AssetType {
  val value = "savings"
}

case object DepositAssetAccount extends AssetType {
  val value = "deposit"
}

case object CreditAssetAccount extends AssetType {
  val value = "credit"
}

case object DebtAssetAccount extends AssetType {
  val value = "debt"
}

case object TradableAssetAccount extends AssetType {
  val value = "tradable"
}

case object BrokerAssetAccount extends AssetType {
  val value = "broker"
}

/**
  * Entity for additional properties of accounts with type 'asset'
 *
  * @param operational 'operational' flag
  * @param favorite 'favorite' flag
  */
case class AssetAccountProperty(id: Option[Long],
                                operational: Boolean,
                                favorite: Boolean,
                                asset_type: AssetType) extends LongIdentifiable

object AssetType {
  def apply(arg: String): AssetType = arg match {
    case "cash" => CashAssetAccount
    case "current"  => CurrentAssetAccount
    case "savings"  => SavingsAssetAccount
    case "deposit"  => DepositAssetAccount
    case "credit"   => CreditAssetAccount
    case "debt"     => DebtAssetAccount
    case "tradable" => TradableAssetAccount
    case "broker"   => BrokerAssetAccount
  }

  def unapply(arg: AssetType): Option[String] = Some(arg.value)
}