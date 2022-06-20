--liquibase formatted sql

--changeset akashihi:1

INSERT INTO SETTING VALUES ('ui.transaction.closedialog', 'true');

--rollback DELETE FROM SETTING WHERE NAME='ui.transaction.closedialog';
