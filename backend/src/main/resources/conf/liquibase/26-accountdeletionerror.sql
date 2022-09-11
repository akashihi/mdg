--liquibase formatted sql

--changeset akashihi:1

INSERT INTO ERROR VALUES('ACCOUNT_IN_USE', '409', 'Used accounts can not be deleted', 'It is forbidden to remove accounts which are participating in the operations');

--rollback DELETE FROM ERROR WHERE CODE='ACCOUNT_IN_USE';

--changeset akashihi:2
ALTER TABLE budgetentry DROP CONSTRAINT budgetentry_account_id_fkey;

ALTER TABLE budgetentry ADD FOREIGN KEY (account_id) REFERENCES account ON DELETE CASCADE;

--rollback ALTER TABLE budgetentry DROP CONSTRAINT budgetentry_account_id_fkey;
--rollback ALTER TABLE budgetentry ADD FOREIGN KEY (account_id) REFERENCES account;