package dao.queries
import java.sql.Date
import java.time.LocalDate
import slick.jdbc.PostgresProfile.api._

import scala.concurrent.ExecutionContext

/**
* Asset totals queries
  */
object AssetQuery {
  /**
    * Calculates remains on asset accounts for specified date.
    * @param term date on which remain is calculated
    * @return remains on that date
    */
  def getTotalAssetsForDate(term: LocalDate)(implicit ec: ExecutionContext): DBIO[BigDecimal] = {
    val dt = Date.valueOf(term)
    sql"""
         select sum(o.amount*coalesce(r.rate,1))
         from operation as o
         left outer join account as a on(o.account_id = a.id)
         inner join tx on (o.tx_id=tx.id)
         inner join setting as s on (s.name='currency.primary')
         left outer join rates as r on (r.from_id=a.currency_id and r.to_id=s.value::bigint and r.rate_beginning <= now() and r.rate_end > now())
         where a.account_type='asset' and tx.ts <  $dt"""
      .as[Option[BigDecimal]]
      .map(_.head)
      .map(_.getOrElse(BigDecimal(0)))
  }

  def getTotalAssetsByCurrencyForDate(term: LocalDate)(implicit ec: ExecutionContext): DBIO[Seq[(Long, BigDecimal)]] = {
    val dt = Date.valueOf(term)
    sql"""
         select a.currency_id, sum(o.amount)
         from operation as o
         left outer join account as a on(o.account_id = a.id)
         inner join tx on (o.tx_id=tx.id)
         where a.account_type='asset' and tx.ts < $dt
         group by a.currency_id"""
      .as[(Long, BigDecimal)]
  }

  def getTotalAssetsByTypeForDate(term: LocalDate)(implicit ec: ExecutionContext): DBIO[Seq[(Long, BigDecimal)]] = {
    val dt = Date.valueOf(term)
    sql"""
         select a.category_id, sum(o.amount*coalesce(r.rate,1))
         from operation as o
         left outer join account as a on(o.account_id = a.id)
         inner join tx on (o.tx_id=tx.id)
         inner join setting as s on (s.name='currency.primary')
         left outer join rates as r on (r.from_id=a.currency_id and r.to_id=s.value::bigint and r.rate_beginning <= now() and r.rate_end > now())
         where a.account_type='asset' and tx.ts < $dt group by a.category_id"""
      .as[(Long, BigDecimal)]
  }
}
