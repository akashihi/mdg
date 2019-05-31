package dao.reporting

import java.sql.Date
import java.time.LocalDate

import models.AccountType
import slick.jdbc.PostgresProfile.api._

import scala.concurrent.ExecutionContext

object BudgetReportQuery {
  def getTotalByTypeForBudgets(accounts: AccountType,
                               beginning: LocalDate,
                               end: LocalDate)
                              (implicit ec: ExecutionContext): DBIO[Seq[(LocalDate, BigDecimal)]] = {
    val b_dt = Date.valueOf(beginning)
    val e_dt = Date.valueOf(end)
    sql"""
        select b.term_beginning, sum(o.amount*coalesce(r.rate,1))
        from budget as b, operation as o
        left outer join account as a on(o.account_id = a.id)
        inner join tx on (o.tx_id=tx.id)
        inner join setting as s on (s.name='currency.primary')
        left outer join rates as r on (r.from_id=a.currency_id and r.to_id=s.value::bigint and r.rate_beginning <= now() and r.rate_end > now())
        where a.account_type=${accounts.value} and tx.ts between b.term_beginning and b.term_end and b.term_end > $b_dt and b.term_beginning < $e_dt
        group by b.term_beginning order by b.term_beginning asc"""
      .as[(Date, BigDecimal)].map(_.map(entry => (entry._1.toLocalDate, entry._2)))
  }

  def getExpectedByTypeForBudgets(accounts: AccountType,
    beginning: LocalDate,
    end: LocalDate)
  (implicit ec: ExecutionContext): DBIO[Seq[(LocalDate, BigDecimal)]] = {
    val b_dt = Date.valueOf(beginning)
    val e_dt = Date.valueOf(end)
    sql"""
        select b.term_beginning, sum(be.expected_amount*coalesce(r.rate,1))
        from budget as b, budgetentry as be
        left outer join account as a on(be.account_id = a.id)
        inner join setting as s on (s.name='currency.primary')
        left outer join rates as r on (r.from_id=a.currency_id and r.to_id=s.value::bigint and r.rate_beginning <= now() and r.rate_end > now())
        where be.budget_id=b.id and a.account_type=${accounts.value} and b.term_end > $b_dt and b.term_beginning < $e_dt
        group by b.term_beginning order by b.term_beginning asc"""
      .as[(Date, BigDecimal)].map(_.map(entry => (entry._1.toLocalDate, entry._2)))
  }
}
