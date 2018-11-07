package dao.reporting

import dao.tables.{Accounts, AssetAccountProperties}
import slick.jdbc.PostgresProfile.api._

object AccountReportQuery {
  val accounts = TableQuery[Accounts]
  val assetAccountProperties = TableQuery[AssetAccountProperties]

  def getTotalsByTypeAndCurrency: DBIO[Seq[(Long, String, BigDecimal)]] = sql"""
    select a.currency_id, t.asset_type, sum(a.balance)
    from account as a, asset_account_properties as t
    where a.hidden = 'f' and a.balance <> 0 and a.id=t.id
    group by t.asset_type, a.currency_id;""".as[(Long, String, BigDecimal)]
}
