# Accounts schema

# --- !Ups

CREATE TABLE ACCOUNT (
  ID BIGSERIAL PRIMARY KEY,
  ACCOUNT_TYPE VARCHAR(7) NOT NULL CHECK(ACCOUNT_TYPE IN ('asset', 'expense', 'income')),
  CURRENCY_ID BIGINT NOT NULL REFERENCES CURRENCY(ID),
  BALANCE DECIMAL(32,2) NOT NULL DEFAULT 0,
  NAME TEXT NOT NULL,
  HIDDEN BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO ERROR VALUES('ACCOUNT_NOT_FOUND', '404', 'Requested account could not be found', 'We can not find account with specified code in the database, check it''s id please.');
INSERT INTO ERROR VALUES('ACCOUNT_DATA_INVALID', '422', 'Account attributes are invalid', 'Some account attributes are missing or have invalid values.');
INSERT INTO ERROR VALUES('ACCOUNT_NOT_UPDATED', '500', 'Account attributes were not updated', 'For some reason account attributes was not updated.');

# --- !Downs
DROP TABLE ACCOUNT;

DELETE FROM ERROR WHERE CODE='ACCOUNT_NOT_FOUND';
DELETE FROM ERROR WHERE CODE='ACCOUNT_DATA_INVALID';
DELETE FROM ERROR WHERE CODE='ACCOUNT_NOT_UPDATED';