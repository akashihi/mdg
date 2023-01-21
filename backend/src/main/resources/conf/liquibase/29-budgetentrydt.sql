--liquibase formatted sql

--changeset akashihi:1
ALTER TABLE BUDGETENTRY ADD COLUMN DT DATE

--rollback ALTER TABLE BUDGETENTRY DROP COLUMN DT;
