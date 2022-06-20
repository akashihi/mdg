--liquibase formatted sql

--changeset akashihi:1
INSERT INTO ERROR VALUES('TRANSACTION_DATA_INVALID', '422', 'Transaction attributes are invalid', 'Some transaction attributes are missing or have invalid values.');
INSERT INTO ERROR VALUES('TRANSACTION_EMPTY', '412', 'Transaction doesn''t contains any operation', 'Ensure that transaction contains at least one non empty operation');
INSERT INTO ERROR VALUES('TRANSACTION_NOT_BALANCED', '412', 'Transaction is not in balance', 'Sum of all transaction operations should be exactly zero.');

--rollback DELETE FROM ERROR WHERE CODE='TRANSACTION_DATA_INVALID';
--rollback DELETE FROM ERROR WHERE CODE='TRANSACTION_EMPTY';
--rollback DELETE FROM ERROR WHERE CODE='TRANSACTION_NOT_BALANCED';
