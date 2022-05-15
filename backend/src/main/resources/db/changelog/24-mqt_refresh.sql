--liquibase formatted sql

--changeset akashihi:1 splitStatements:false

CREATE OR REPLACE FUNCTION refresh_account_balance() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
    refresh materialized view account_balance;
    return null;
END;
$$;

create trigger refresh_account_balance
    after insert or update or delete or truncate
    on operation for each statement
execute procedure refresh_account_balance();

DROP FUNCTION account_op_upd();
DROP FUNCTION account_op_del();
DROP FUNCTION account_op_add();