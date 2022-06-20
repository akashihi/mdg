--liquibase formatted sql

--changeset akashihi:1

CREATE INDEX op_tx_id ON operation USING HASH(tx_id);
CREATE INDEX op_acc_id ON operation USING HASH(account_id);
CREATE INDEX range_b ON rates USING btree (rate_beginning);
CREATE INDEX range_r ON rates USING btree (rate_end);

--rollback DROP INDEX op_tx_id;
--rollback DROP INDEX op_acc_id;
--rollback DROP INDEX range_b;
--rollback DROP INDEX range_r;
