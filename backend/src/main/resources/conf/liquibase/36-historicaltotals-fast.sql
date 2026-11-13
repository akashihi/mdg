--liquibase formatted sql

--changeset akashihi:1 splitStatements:false

drop materialized view historical_balance;

create materialized view historical_balance as
(
with days  as (select generate_series(date(min(ts)), greatest(date(min(ts)), date(now())), interval '1 day')::date as dt from tx),
     daily as (select o.account_id as id, date(t.ts) as dt, sum(o.amount) as amount
               from operation o
                        join tx t on t.id = o.tx_id
               group by 1, 2),
     bal   as (select d.dt, a.id, a.currency_id,
                      sum(coalesce(daily.amount, 0)) over (partition by a.id order by d.dt) as amount
               from days d
                        cross join account a
                        left join daily on daily.id = a.id and daily.dt = d.dt
               where a.account_type = 'asset'),
     rate  as (select currency_id, to_current_default_currency(currency_id, 1) as r
               from (select distinct currency_id from account where account_type = 'asset') c)
select b.dt, b.id, b.amount, b.amount * rate.r as primaryamount
from bal b
         join rate using (currency_id))
with data;

create unique index historical_balance_dt on historical_balance(dt, id);
