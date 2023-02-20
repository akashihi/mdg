--liquibase formatted sql

--changeset akashihi:1 splitStatements:false

create materialized view historical_balance as
select date(gs.dt)                                               as dt,
       a.id                                                      as id,
       sum(o.amount)                                             as amount,
       sum(to_current_default_currency(a.currency_id, o.amount)) as primaryAmount
from account as a
         left outer join operation as o on (o.account_id = a.id)
         inner join tx on (o.tx_id = tx.id)
         cross join generate_series((select min(ts) from tx), now(), '1 day') gs(dt)
where date(tx.ts) <= date(gs.dt)
group by date(gs.dt), a.id
with no data;

create unique index historical_balance_dt on historical_balance(dt, id);

--changeset akashihi:2 splitStatements:false

REFRESH MATERIALIZED VIEW historical_balance;


