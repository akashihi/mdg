package org.akashihi.mdg.dao

import org.akashihi.mdg.dao.projections.AmountAndDate
import org.akashihi.mdg.dao.projections.AmountDateName
import org.akashihi.mdg.dao.projections.AmountNameCategory
import org.akashihi.mdg.entity.Account
import org.akashihi.mdg.entity.AccountType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import java.math.BigDecimal
import java.time.LocalDate

interface AccountRepository : JpaRepository<Account, Long>, JpaSpecificationExecutor<Account> {
    @Modifying
    @Query(nativeQuery = true, value = "UPDATE ACCOUNT SET CATEGORY_ID=null WHERE category_id = ?1")
    fun dropCategory(id: Long)

    @Modifying
    @Query(nativeQuery = true, value = "refresh materialized view concurrently historical_balance with data")
    fun refreshHistoricalBalance()

    @Query(nativeQuery = true, value = "select sum(h.primaryamount) as amount, gs.dt as dt from generate_series(?1\\:\\:timestamp, ?2\\:\\:timestamp, make_interval(days \\:= ?3)) gs(dt) join historical_balance as h on h.dt=gs.dt group by gs.dt order by gs.dt")
    fun getTotalAssetsReport(from: LocalDate, to: LocalDate, interval: Int): List<AmountAndDate>

    @Query(
        nativeQuery = true,
        value = "select sum(h.amount) as amount,sum(h.primaryamount) as primaryAmount, c.code as name, gs.dt as dt from generate_series(?1\\:\\:timestamp, ?2\\:\\:timestamp, make_interval(days \\:= ?3)) gs(dt) join historical_balance as h on h.dt=gs.dt inner join account as a on h.id = a.id inner join currency as c on c.id=a.currency_id group by gs.dt,c.code order by gs.dt,c.code"
    )
    fun getTotalAssetsReportByCurrency(from: LocalDate, to: LocalDate, interval: Int): List<AmountDateName>

    @Query(
        nativeQuery = true,
        value = "select sum(h.amount) as amount,sum(h.primaryamount) as primaryAmount, c.name as name, gs.dt as dt from generate_series(?1\\:\\:timestamp, ?2\\:\\:timestamp, make_interval(days \\:= ?3)) gs(dt) join historical_balance as h on h.dt=gs.dt inner join account as a on h.id = a.id inner join category as c on c.id=a.category_id group by gs.dt, c.name order by gs.dt, c.name"
    )
    fun getTotalAssetsReportByType(from: LocalDate, to: LocalDate, interval: Int): List<AmountDateName>

    @Query(
        nativeQuery = true,
        value = "select sum(to_current_default_currency(a.currency_id, o.amount)) from operation as o left outer join account as a on(o.account_id = a.id) inner join tx on (o.tx_id=tx.id) where a.account_type='asset' and tx.ts < ?1"
    )
    fun getTotalAssetsForDate(dt: LocalDate): BigDecimal?

    @Query(
        nativeQuery = true,
        value = "select sum(h.primaryamount) as amount from historical_balance as h join account as a on a.id=h.id where a.operational is true and h.dt = ?1"
    )
    fun getTotalOperationalAssetsForDate(dt: LocalDate): BigDecimal?

    @Query(
        nativeQuery = true,
        value = "select sum(o.amount) as amount, sum(to_current_default_currency(a.currency_id, o.amount)) as primaryAmount, a.name as name, a.category_id as categoryId from operation as o left outer join account as a on(o.account_id = a.id) inner join tx on (o.tx_id=tx.id) where a.account_type=?1 and tx.ts between ?2 and ?3 group by a.category_id,a.name order by a.name"
    )
    fun getTotalByAccountTypeForRange(type: String, from: LocalDate, to: LocalDate): List<AmountNameCategory>
    fun findAllByAccountType(type: AccountType): Collection<Account>

    @Query(
        nativeQuery = true,
        value = "select sum(h.primaryamount) as amount, h.dt as dt from historical_balance as h join account as a on a.id=h.id where a.operational is true and dt between ?1\\:\\:date and ?2\\:\\:date group by h.dt order by h.dt;"
    )
    fun getOperationalAssetsForDateRange(from: LocalDate, to: LocalDate): Collection<AmountAndDate>

    @Query(
        nativeQuery = true,
        value = "select a.id, count(a.id) as popularity from account as a inner join operation o on a.id = o.account_id inner join tx t on t.id = o.tx_id where t.ts > now() - interval '3 months' and a.account_type=?1 group by a.id order by popularity desc limit 3"
    )
    fun getPopularAccountsForType(type: String): Collection<Long>
}
