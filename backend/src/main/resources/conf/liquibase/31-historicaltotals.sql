--liquibase formatted sql

--changeset akashihi:1 splitStatements:false

create materialized view historical_balance as (with recursive totals as (select initial.dt, a.id as id, sum(o.amount) as amount
                                                                   from account as a
                                                                            cross join (select date(min(ts)) as dt from tx) as initial
                                                                            right outer join operation o on a.id = o.account_id
                                                                            inner join tx t on t.id = o.tx_id
                                                                   group by initial.dt, a.id
                                                                   union
                                                                   select date(dt + interval '1 day'), t.id, t.amount + coalesce((select sum(o.amount) from operation as o, tx as tx where tx.id=o.tx_id and o.account_id=t.id and date(tx.ts) = dt + interval '1 day'), 0)
                                                                   from totals as t
                                                                   where dt + interval '1 day' <= date(now()))

                                        select t.dt as dt, t.id as id, t.amount as amount, to_current_default_currency((select currency_id from account as a where a.id = t.id), t.amount) as primaryAmount
                                        from totals as t) with data;

create unique index historical_balance_dt on historical_balance(dt, id);



