--liquibase formatted sql

--changeset akashihi:1

INSERT INTO ERROR VALUES('ACCOUNT_CURRENCY_ASSET', '422', 'No currency change for asset accounts', 'It is forbidden to change currency on asset accounts');

--rollback DELETE FROM ERROR WHERE CODE='ACCOUNT_CURRENCY_ASSET';