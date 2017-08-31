--liquibase formatted sql

--changeset akashihi:1

CREATE TABLE SETTING (
  NAME VARCHAR(255) PRIMARY KEY,
  VALUE VARCHAR(255) NOT NULL
);

INSERT INTO SETTING VALUES ('currency.primary', '978');

INSERT INTO ERROR VALUES('SETTING_NOT_FOUND', '404', 'Requested setting could not be found', 'We can not find specified setting in the database, check it''s name please.');
INSERT INTO ERROR VALUES('SETTING_DATA_INVALID', '422', 'Setting value is invalid', 'Setting value is invalid an cannot be accepted.');

--rollback DROP TABLE SETTING;
--rollback DELETE FROM ERROR WHERE CODE='SETTING_NOT_FOUND'
--rollback DELETE FROM ERROR WHERE CODE='SETTING_DATA_INVALID'
