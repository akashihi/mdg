--liquibase formatted sql

--changeset akashihi:1
CREATE MATERIALIZED VIEW account_balance AS select account_id,sum(amount) as balance from operation group by account_id;

DROP TRIGGER op_upd ON operation;
DROP TRIGGER op_del ON operation;
DROP TRIGGER op_add ON operation;

--rollback DROP VIEW account_balance;
--rollback CREATE TRIGGER op_add AFTER INSERT ON operation FOR EACH ROW EXECUTE PROCEDURE account_op_add();
--rollback CREATE TRIGGER op_del BEFORE DELETE ON operation FOR EACH ROW EXECUTE PROCEDURE account_op_del();
--rollback CREATE TRIGGER op_upd BEFORE UPDATE ON operation FOR EACH ROW EXECUTE PROCEDURE account_op_upd();


--changeset akashihi:2
ALTER TABLE account DROP COLUMN balance;

--rollback ALTER TABLE account ADD COLUMN balance NUMERIC(32,2) NOT NULL DEFAULT 0;
--rollback UPDATE account AS a SET balance=COALESCE((SELECT SUM(amount) FROM operation WHERE account_id=a.id),0);