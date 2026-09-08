--liquibase formatted sql

--changeset akashihi:1 splitStatements:false

-- The overlap guard counted the row being updated against itself, so any UPDATE
-- that kept or extended a budget's own term raised, and a budget's term could
-- never be changed. Exclude the row being updated; on INSERT no row with NEW.ID
-- exists yet, so the extra condition is a no-op there.
CREATE OR REPLACE FUNCTION budget_add_upd() RETURNS TRIGGER
AS $account_op_add$
DECLARE
BEGIN
  IF EXISTS(SELECT 1 FROM BUDGET WHERE (BUDGET.ID <> NEW.ID) AND (NEW.TERM_BEGINNING <= TERM_END) AND (NEW.TERM_END >= BUDGET.TERM_BEGINNING)) THEN
    RAISE EXCEPTION 'Overlapping budget terms detected';
  END IF;
  RETURN NEW;
END;
$account_op_add$ LANGUAGE plpgsql;

--rollback CREATE OR REPLACE FUNCTION budget_add_upd() RETURNS TRIGGER AS $account_op_add$ DECLARE BEGIN IF EXISTS(SELECT 1 FROM BUDGET WHERE (NEW.TERM_BEGINNING <= TERM_END) AND (NEW.TERM_END >= BUDGET.TERM_BEGINNING)) THEN RAISE EXCEPTION 'Overlapping budget terms detected'; END IF; RETURN NEW; END; $account_op_add$ LANGUAGE plpgsql;
