--liquibase formatted sql

--changeset akashihi:1

CREATE TABLE BUDGET (
  ID BIGINT PRIMARY KEY,
  TERM_BEGINNING DATE NOT NULL,
  TERM_END DATE NOT NULL
);

--rollback DROP TABLE BUDGET;

--changeset akashihi:2 splitStatements:false
CREATE OR REPLACE FUNCTION budget_add_upd() RETURNS TRIGGER
AS $account_op_add$
DECLARE
BEGIN
  IF EXISTS(SELECT 1 FROM BUDGET WHERE (NEW.TERM_BEGINNING <= TERM_END) AND (NEW.TERM_END >= BUDGET.TERM_BEGINNING)) THEN
    RAISE EXCEPTION 'Overlapping budget terms detected';
  END IF;
  RETURN NEW;
END;
$account_op_add$ LANGUAGE plpgsql;

CREATE TRIGGER budget_add_upd BEFORE INSERT OR UPDATE ON budget FOR EACH ROW EXECUTE PROCEDURE budget_add_upd();

--rollback DROP TRIGGER budget_add_upd ON budget;
--rollback DROP FUNCTION budget_add_upd();

--changeset akashihi:3

INSERT INTO ERROR VALUES('BUDGET_NOT_FOUND', '404', 'Requested budget could not be found', 'We can not find budget with specified code in the database, check it''s id please.');

--rollback DELETE FROM ERROR WHERE CODE='BUDGET_NOT_FOUND';

--changeset akashihi:4

INSERT INTO ERROR VALUES('BUDGET_OVERLAPPING', '412', 'Budget validity period overlapping detected', 'Budget validity period overlaps with other, already existing budgets');

--rollback DELETE FROM ERROR WHERE CODE='BUDGET_OVERLAPPING';
