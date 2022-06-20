--liquibase formatted sql

--changeset akashihi:1

INSERT INTO SETTING VALUES ('ui.language', 'us');

--rollback DELETE FROM SETTING WHERE NAME='ui.language';

--changeset akashihi:2

UPDATE SETTING SET value = 'en-US' WHERE name = 'ui.language';

--rollback UPDATE SETTING SET value = 'us' WHERE name = 'ui.language';
