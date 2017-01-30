# Errors schema

# --- !Ups

CREATE TABLE ERROR (
  CODE VARCHAR(32) PRIMARY KEY,
  STATUS CHAR(3) NOT NULL,
  TITLE TEXT NOT NULL,
  DETAIL TEXT
);

INSERT INTO ERROR VALUES('CURRENCY_NOT_FOUND', '404', 'Requested currency could not be found', 'We can not find currency with specified code in the database, check it''s id please.');

# --- !Downs
DROP TABLE ERROR;