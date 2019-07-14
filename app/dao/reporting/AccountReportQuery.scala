package dao.reporting

import dao.tables.{Accounts, AssetAccountProperties}
import slick.jdbc.PostgresProfile.api._

object AccountReportQuery {
  val accounts = TableQuery[Accounts]
  val assetAccountProperties = TableQuery[AssetAccountProperties]

  def getTotalsByTypeAndCurrency: DBIO[Seq[(Long, Long, BigDecimal)]] = sql"""
    select a.currency_id, a.category_id, sum(a.balance)
    from account as a
    where a.hidden = 'f' and a.balance <> 0 and a.account_type = 'asset'
    group by a.category_id, a.currency_id;""".as[(Long, Long, BigDecimal)]
}
