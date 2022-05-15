--liquibase formatted sql

--changeset akashihi:1

CREATE TABLE BUDGETENTRY (
  ID BIGSERIAL PRIMARY KEY,
  BUDGET_ID BIGINT NOT NULL REFERENCES BUDGET(ID) ON DELETE CASCADE,
  ACCOUNT_ID BIGINT NOT NULL REFERENCES ACCOUNT(ID),
  EVEN_DISTRIBUTION BOOLEAN NOT NULL DEFAULT TRUE,
  PRORATION BOOLEAN DEFAULT TRUE,
  EXPECTED_AMOUNT DECIMAL(32,2) NOT NULL DEFAULT 0
);

--rollback DROP TABLE BUDGETENTRY;

--changeset akashihi:2 splitStatements:false

CREATE OR REPLACE FUNCTION budget_entry_add() RETURNS TRIGGER
AS $budget_entry_add$
DECLARE
  ACCOUNT_ID BIGINT;
BEGIN
  FOR ACCOUNT_ID IN
    SELECT id FROM account WHERE account_type<>'asset'
  LOOP
    INSERT INTO budgetentry (budget_id, account_id) VALUES (NEW.ID, account_id);
  END LOOP;
  RETURN NEW;
END;
$budget_entry_add$ LANGUAGE plpgsql;

CREATE TRIGGER entry_add AFTER INSERT ON budget FOR EACH ROW EXECUTE PROCEDURE budget_entry_add();

CREATE OR REPLACE FUNCTION budget_account_add() RETURNS TRIGGER
AS $budget_account_add$
DECLARE
  BUDGET_ID BIGINT;
BEGIN
  FOR BUDGET_ID IN
  SELECT id FROM budget
  LOOP
    INSERT INTO budgetentry (budget_id, account_id) VALUES (BUDGET_ID, NEW.ID);
  END LOOP;
  RETURN NEW;
END;
$budget_account_add$ LANGUAGE plpgsql;

CREATE TRIGGER budget_add AFTER INSERT ON account FOR EACH ROW WHEN (NEW.ACCOUNT_TYPE<>'asset') EXECUTE PROCEDURE budget_account_add();

--rollback DROP TRIGGER entry_add ON budget;
--rollback DROP TRIGGER budget_add ON account;
--rollback DROP FUNCTION budget_entry_add();
--rollback DROP FUNCTION budget_account_add();

--changeset akashihi:3

ALTER TABLE budgetentry ADD CONSTRAINT one_acc_per_budget UNIQUE (budget_id, account_id);

--rollback ALTER TABLE budgetentry DROP CONSTRAINT one_acc_per_budget;

--changeset akashihi:4

INSERT INTO ERROR VALUES('BUDGETENTRY_NOT_FOUND', '404', 'Requested budget entry could not be found', 'We can not find budget entry with specified code in the database, check it''s id please.');

--rollback DELETE FROM ERROR WHERE CODE='BUDGETENTRY_NOT_FOUND'
