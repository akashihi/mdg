--liquibase formatted sql

--changeset akashihi:1
ALTER TABLE OPERATION ADD COLUMN RATE DECIMAL(32,4) NOT NULL DEFAULT 1;

--rollback ALTER TABLE OPERATION DROP COLUMN RATE;

--changeset akashihi:2
INSERT INTO ERROR VALUES('TRANSACTION_AMBIGUOUS_RATE', '412', 'Transaction rate settings are ambigous', 'Ensure that default rate is specified for a operation on a single currency');
INSERT INTO ERROR VALUES('TRANSACTION_NO_DEFAULT_RATE', '412', 'Transaction doesn''t have default rate', 'Transaction contains operation on different currencies, but not operation defines default rate');
INSERT INTO ERROR VALUES('TRANSACTION_ZERO_RATE', '412', 'Transaction contains zero rate', 'Operations with rate zero are not allowed');


--rollback DELETE FROM ERROR WHERE CODE='TRANSACTION_AMBIGUOUS_RATE'
--rollback DELETE FROM ERROR WHERE CODE='TRANSACTION_NO_DEFAULT_RATE'
--rollback DELETE FROM ERROR WHERE CODE='TRANSACTION_ZERO_RATE'
