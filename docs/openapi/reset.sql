-- Development database only — this deletes everything.

BEGIN;

DELETE FROM operation;
DELETE FROM tx;                     -- tx_tags cascades from tx
DELETE FROM budgetentry;
DELETE FROM budget;
DELETE FROM account;
DELETE FROM category WHERE id > 8;  -- keep the eight asset categories from 20-assetcategory.sql

INSERT INTO account (account_type, currency_id, name, hidden)
     VALUES ('expense', 978, 'Schemathesis expense', false);

-- Example budget, so /budgets/current returns meaningful value
INSERT INTO budget (id, term_beginning, term_end)
     VALUES (20310101, '2031-01-01', '2031-01-31');

COMMIT;
