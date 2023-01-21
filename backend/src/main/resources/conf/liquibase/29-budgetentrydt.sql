--liquibase formatted sql

--changeset akashihi:1
ALTER TABLE BUDGETENTRY ADD COLUMN DT DATE

--rollback ALTER TABLE BUDGETENTRY DROP COLUMN DT;

--changeset akashihi:2
INSERT INTO ERROR VALUES('BUDGETENTRY_DT_OUT_OF_BUDGET', '409', 'Transaction date outside of budget limits', 'Budget operations should happen only during the budget period');
--rollback DELETE FROM ERROR WHERE CODE='BUDGETENTRY_DT_OUT_OF_BUDGET';
