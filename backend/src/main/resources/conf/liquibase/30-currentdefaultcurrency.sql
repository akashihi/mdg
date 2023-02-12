--liquibase formatted sql

--changeset akashihi:1 splitStatements:false

CREATE OR REPLACE FUNCTION to_current_default_currency(currency bigint, amount numeric(32, 2)) RETURNS numeric(32, 2)
    LANGUAGE sql AS
$$
    select amount * coalesce((select r.rate
                              from setting as s,
                                   rates as r
                              where s.name = 'currency.primary'
                                and r.from_id = currency
                                and r.to_id = s.value::bigint
                                and r.rate_beginning <= now()
                                and r.rate_end > now()), 1);
$$;
