--liquibase formatted sql

--changeset akashihi:1

INSERT INTO ERROR VALUES('BUDGETENTRY_IS_NEGATIVE', '422', 'Budget entry value is negative', 'Expected budget entry amount should be zero or positive value');

--rollback DELETE FROM ERROR WHERE code = 'BUDGETENTRY_IS_NEGATIVE'
