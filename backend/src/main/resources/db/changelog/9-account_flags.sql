--liquibase formatted sql

--changeset akashihi:1

ALTER TABLE ACCOUNT ADD COLUMN OPERATIONAL BOOLEAN NOT NULL DEFAULT 'f';
ALTER TABLE ACCOUNT ADD COLUMN FAVORITE BOOLEAN NOT NULL DEFAULT 'f';

--rollback ALTER TABLE ACCOUNT DROP COLUMN OPERATIONAL;
--rollback ALTER TABLE ACCOUNT DROP COLUMN FAVORITE;

--changeset akashihi:2
INSERT INTO ERROR VALUES('ACCOUNT_NONASSET_INVALIDFLAG', '412', 'Account flags are invalid', 'Only accounts of type ''asset'' could have operational of favorite flags set.');

--rollback DELETE FROM ERROR WHERE CODE='ACCOUNT_NONASSET_INVALIDFLAG';
