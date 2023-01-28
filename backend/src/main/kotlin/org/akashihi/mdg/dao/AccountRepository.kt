package org.akashihi.mdg.dao

import org.akashihi.mdg.dao.projections.AmountAndDate
import org.akashihi.mdg.dao.projections.AmountAndName
import org.akashihi.mdg.dao.projections.AmountNameCategory
import org.akashihi.mdg.entity.Account
import org.akashihi.mdg.entity.AccountType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import java.math.BigDecimal
import java.time.LocalDate
import java.util.*

interface AccountRepository : JpaRepository<Account, Long>, JpaSpecificationExecutor<Account> {
    @Modifying
    @Query(nativeQuery = true, value = "UPDATE ACCOUNT SET CATEGORY_ID=null WHERE category_id = ?1")
    fun dropCategory(id: Long)

    @Query(nativeQuery = true, value = "SELECT balance FROM account_balance WHERE account_id = ?1")
    fun getBalance(id: Long): BigDecimal?

    @Query(
        nativeQuery = true,
        value = "select sum(o.amount*coalesce(r.rate,1)) from operation as o left outer join account as a on(o.account_id = a.id) inner join tx on (o.tx_id=tx.id) inner join setting as s on (s.name='currency.primary') left outer join rates as r on (r.from_id=a.currency_id and r.to_id=s.value\\:\\:bigint and r.rate_beginning <= now() and r.rate_end > now()) where a.account_type='asset' and tx.ts < ?1"
    )
    fun getTotalAssetsForDate(dt: LocalDate): BigDecimal?

    @Query(
        nativeQuery = true,
        value = "select sum(o.amount*coalesce(r.rate,1)) from operation as o left outer join account as a on(o.account_id = a.id) inner join tx on (o.tx_id=tx.id) inner join setting as s on (s.name='currency.primary') left outer join rates as r on (r.from_id=a.currency_id and r.to_id=s.value\\:\\:bigint and r.rate_beginning <= now() and r.rate_end > now()) where a.account_type='asset'  and a.operational is True and tx.ts < ?1"
    )
    fun getTotalOperationalAssetsForDate(dt: LocalDate): BigDecimal?

    @Query(
        nativeQuery = true,
        value = "select sum(o.amount) as amount, sum(o.amount*coalesce(r.rate,1)) as primaryAmount, c.code as name from operation as o left outer join account as a on (o.account_id = a.id) inner join tx on (o.tx_id = tx.id) inner join currency c on c.id = a.currency_id inner join setting as s on (s.name='currency.primary') left outer join rates r on (c.id = r.from_id and r.to_id=s.value\\:\\:bigint and r.rate_beginning <= ?1 and r.rate_end > ?1) where a.account_type = 'asset' and tx.ts < ?1 group by c.code;"
    )
    fun getTotalAssetsForDateByCurrency(dt: LocalDate): List<AmountAndName>

    @Query(
        nativeQuery = true,
        value = "select sum(o.amount) as amount, sum(o.amount*coalesce(r.rate,1)) as primaryAmount, c.name as name from operation as o left outer join account as a on(o.account_id = a.id) inner join tx on (o.tx_id=tx.id) inner join setting as s on (s.name='currency.primary') inner join category c on c.id = a.category_id left outer join rates as r on (r.from_id=a.currency_id and r.to_id=s.value\\:\\:bigint and r.rate_beginning <= now() and r.rate_end > now()) where a.account_type='asset' and tx.ts < ?1 group by c.name"
    )
    fun getTotalAssetsForDateByType(dt: LocalDate): List<AmountAndName>

    @Query(
        nativeQuery = true,
        value = "select sum(o.amount) as amount, sum(o.amount*coalesce(r.rate,1)) as primaryAmount, a.name as name, a.category_id as categoryId from operation as o left outer join account as a on(o.account_id = a.id) inner join tx on (o.tx_id=tx.id) inner join setting as s on (s.name='currency.primary') left outer join rates as r on (r.from_id=a.currency_id and r.to_id=s.value\\:\\:bigint and r.rate_beginning <= now() and r.rate_end > now()) where a.account_type=?1 and tx.ts between ?2 and ?3 group by a.category_id,a.name order by a.name"
    )
    fun getTotalByAccountTypeForRange(type: String, from: LocalDate, to: LocalDate): List<AmountNameCategory>
    fun findAllByAccountType(type: AccountType): Collection<Account>

    @Query(
        nativeQuery = true,
        value = "select sum(o.amount*coalesce(r.rate,1)) as amount, date(gs.dt) as dt from operation as o left outer join account as a on(o.account_id = a.id) inner join tx on (o.tx_id=tx.id) inner join setting as s on (s.name='currency.primary') left outer join rates as r on (r.from_id=a.currency_id and r.to_id=s.value\\:\\:bigint and r.rate_beginning <= now() and r.rate_end > now()) cross join generate_series(?1\\:\\:timestamp, ?2\\:\\:timestamp, '1 day') gs(dt) where a.account_type='asset' and a.operational is True and tx.ts <= gs.dt group by date(gs.dt) order by date(gs.dt)"
    )
    fun getOperationalAssetsForDateRange(from: LocalDate, to: LocalDate): Collection<AmountAndDate>

    @Query(
        nativeQuery = true,
        value = "select a.id, count(a.id) as popularity from account as a inner join operation o on a.id = o.account_id inner join tx t on t.id = o.tx_id where t.ts > now() - interval '3 months' and a.account_type=?1 group by a.id order by popularity desc limit 3"
    )
    fun getPopularAccountsForType(type: String): Collection<Long>
}
