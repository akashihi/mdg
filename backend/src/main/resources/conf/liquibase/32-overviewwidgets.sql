--liquibase formatted sql

--changeset akashihi:1

INSERT INTO SETTING VALUES ('ui.overviewpanel.widgets', '{"lt":"finance","rt":"asset","lb":"budget","rb":"transactions"}');

--rollback DELETE FROM SETTING WHERE NAME='ui.overviewpanel.widgets';
