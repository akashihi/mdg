--liquibase formatted sql

--changeset akashihi:1
ALTER TABLE ASSET_ACCOUNT_PROPERTIES ADD COLUMN ASSET_TYPE VARCHAR(7) NOT NULL CHECK(ASSET_TYPE IN ('cash', 'current', 'savings', 'deposit', 'credit', 'debt', 'tradable', 'broker')) DEFAULT 'current';
ALTER TABLE ACCOUNT DROP COLUMN OPERATIONAL;
ALTER TABLE ACCOUNT DROP COLUMN FAVORITE;

