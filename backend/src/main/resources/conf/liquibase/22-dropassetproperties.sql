--liquibase formatted sql

--changeset akashihi:1
ALTER TABLE ACCOUNT ADD COLUMN OPERATIONAL BOOLEAN DEFAULT 'f';
ALTER TABLE ACCOUNT ADD COLUMN FAVORITE BOOLEAN DEFAULT 'f';

UPDATE account as a SET operational=(SELECT operational FROM asset_account_properties AS aap where aap.id=a.id) WHERE a.account_type='asset';
UPDATE account as a SET favorite=(SELECT favorite FROM asset_account_properties AS aap where aap.id=a.id) WHERE a.account_type='asset';

DROP TABLE asset_account_properties;

--rollback CREATE TABLE ASSET_ACCOUNT_PROPERTIES (ID BIGINT PRIMARY KEY, OPERATIONAL BOOLEAN NOT NULL DEFAULT 'f', FAVORITE BOOLEAN NOT NULL DEFAULT 'f');
--rollback INSERT INTO ASSET_ACCOUNT_PROPERTIES SELECT ID, OPERATIONAL, FAVORITE FROM ACCOUNT WHERE ACCOUNT_TYPE = 'asset';
--rollback ALTER TABLE ACCOUNT DROP COLUMN OPERATIONAL;
--rollback ALTER TABLE ACCOUNT DROP COLUMN FAVORITE;
