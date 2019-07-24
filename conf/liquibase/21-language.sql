--liquibase formatted sql

--changeset akashihi:1

INSERT INTO SETTING VALUES ('ui.language', 'us');

--rollback DELETE FROM SETTING WHERE NAME='ui.language';
