--liquibase formatted sql

--changeset akashihi:1
ALTER TABLE ASSET_ACCOUNT_PROPERTIES ADD COLUMN ASSET_TYPE VARCHAR(7) NOT NULL CHECK(ASSET_TYPE IN ('cash', 'current', 'savings', 'deposit', 'credit', 'debt', 'tradable', 'broker')) DEFAULT 'current';
ALTER TABLE ACCOUNT DROP COLUMN OPERATIONAL;
ALTER TABLE ACCOUNT DROP COLUMN FAVORITE;

--changeset akashihi:2
ALTER TABLE ASSET_ACCOUNT_PROPERTIES ADD CONSTRAINT AP_TO_A FOREIGN KEY(ID) REFERENCES ACCOUNT(ID) ON DELETE CASCADE;

--rollback ALTER TABLE ASSET_ACCOUNT_PROPERTIES DROP CONSTRAINT AP_TO_A;

--changeset akashihi:3
ALTER TABLE ASSET_ACCOUNT_PROPERTIES ALTER COLUMN ASSET_TYPE TYPE VARCHAR(8);

--rollback ALTER TABLE ASSET_ACCOUNT_PROPERTIES ALTER COLUMN TYPE ASSET_TYPE VARCHAR(7);