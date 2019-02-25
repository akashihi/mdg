package dao.reporting
import java.sql.Date
import java.time.LocalDate

import models.AccountType
import slick.jdbc.PostgresProfile.api._

import scala.concurrent.ExecutionContext

object EventsReportQuery {
  def getTotalByAccountForDate(accounts: AccountType,
                                      beginning: LocalDate,
                                      end: LocalDate)
                                     (implicit ec: ExecutionContext): DBIO[Seq[(Long, BigDecimal)]] = {
    val b_dt = Date.valueOf(beginning)
    val e_dt = Date.valueOf(end)
    sql"""
         select a.id, sum(o.amount*coalesce(r.rate,1))
         from operation as o
         left outer join account as a on(o.account_id = a.id)
         inner join tx on (o.tx_id=tx.id)
         inner join setting as s on (s.name='currency.primary')
         left outer join rates as r on (r.from_id=a.currency_id and r.to_id=s.value::bigint and r.rate_beginning <= now() and r.rate_end > now())
         where a.account_type=${accounts.value} and tx.ts between $b_dt and $e_dt group by a.id order by a.name"""
      .as[(Long, BigDecimal)]
  }

}
