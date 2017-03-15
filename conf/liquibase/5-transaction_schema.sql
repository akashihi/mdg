--liquibase formatted sql

--changeset akashihi:1
CREATE TABLE TAG (
  ID BIGSERIAL PRIMARY KEY,
  TAG TEXT NOT NULL UNIQUE
);

CREATE TABLE TX (
  ID BIGSERIAL PRIMARY KEY,
  TS TIMESTAMP NOT NULL DEFAULT NOW(),
  COMMENT TEXT
);

CREATE TABLE TX_TAGS (
  TAG_ID BIGINT NOT NULL REFERENCES TAG(ID) ON DELETE RESTRICT,
  TX_ID BIGINT NOT NULL REFERENCES TX(ID) ON DELETE CASCADE,
  PRIMARY KEY (TAG_ID, TX_ID)
);

CREATE TABLE OPERATION (
  ID BIGSERIAL PRIMARY KEY,
  TX_ID BIGINT NOT NULL REFERENCES TX(ID) ON DELETE CASCADE,
  ACCOUNT_ID BIGINT NOT NULL REFERENCES ACCOUNT(ID) ON DELETE RESTRICT,
  AMOUNT DECIMAL(32,2) NOT NULL DEFAULT 0
);

--rollback DROP TABLE OPERATION;
--rollback DROP TABLE TX_TAGS;
--rollback DROP TABLE TX;
--rollback DROP TABLE TAG;

--changeset akashihi:2 splitStatements:false
CREATE OR REPLACE FUNCTION account_op_add() RETURNS TRIGGER
AS $account_op_add$
DECLARE
  CURRENT DECIMAL(32,2);
BEGIN
  SELECT balance INTO current FROM account WHERE id = NEW.ACCOUNT_ID;
  UPDATE account SET balance = current + NEW.AMOUNT WHERE id = NEW.ACCOUNT_ID;
  RETURN NEW;
END;
$account_op_add$ LANGUAGE plpgsql;

CREATE TRIGGER op_add AFTER INSERT ON operation FOR EACH ROW EXECUTE PROCEDURE account_op_add();

CREATE OR REPLACE FUNCTION account_op_del() RETURNS TRIGGER
AS $account_op_del$
DECLARE
  CURRENT DECIMAL(32,2);
BEGIN
  SELECT balance INTO current FROM account WHERE id = OLD.ACCOUNT_ID;
  UPDATE account SET balance = current + -1 * OLD.AMOUNT WHERE id = OLD.ACCOUNT_ID;
  RETURN OLD;
END;
$account_op_del$ LANGUAGE plpgsql;

CREATE TRIGGER op_del BEFORE DELETE ON operation FOR EACH ROW EXECUTE PROCEDURE account_op_del();

CREATE OR REPLACE FUNCTION account_op_upd() RETURNS TRIGGER
AS $account_op_upd$
BEGIN
  RAISE EXCEPTION 'Operations can not be updated';
END;
$account_op_upd$ LANGUAGE plpgsql;

CREATE TRIGGER op_upd BEFORE UPDATE ON operation FOR EACH ROW EXECUTE PROCEDURE account_op_upd();

--rollback DROP TRIGGER op_upd ON operation;
--rollback DROP TRIGGER op_del ON operation;
--rollback DROP TRIGGER op_add ON operation;
--rollback DROP FUNCTION account_op_upd();
--rollback DROP FUNCTION account_op_del();
--rollback DROP FUNCTION account_op_add();

--changeset akashihi:3
INSERT INTO ERROR VALUES('TRANSACTION_NOT_FOUND', '404', 'Requested transaction could not be found', 'We can not find transaction with specified code in the database, check it''s id please.');

--rollback DELETE FROM ERROR WHERE CODE = 'TRANSACTION_NOT_FOUND';

