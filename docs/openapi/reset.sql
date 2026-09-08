-- Put the development database back to its seeded state, then leave one non-asset
-- account behind. Used by docs/openapi/schemathesis.sh before every run.
--
-- The purge is the important half. A stateful run creates accounts, transactions and
-- budgets on every pass; budget terms are generated, so once enough budgets pile up
-- every POST /budgets fails with BUDGET_OVERLAPPING and the whole budget half of the
-- state machine goes quiet. The expense account is what makes budget entries exist:
-- entries are created for income and expense accounts only, at the moment a budget is
-- created, so without one GET /budgets/{budgetId}/entries returns an empty list and the
-- links that read an entry id cannot resolve.
--
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

-- A budget for the links on GET /budgets to act on from the first step, so the budget
-- half of the state machine does not have to spend its budget on a POST /budgets that
-- usually answers 412. The trigger on budget insert gives it an entry for the account
-- above, which is what the two entry links read.
--
-- The term is deliberately far in the future: the examples phase asks for budget
-- `20170205`, and that path segment resolves to the budget whose term begins closest
-- before the given date. A seeded budget beginning in 2017 or earlier would be found —
-- and deleted — by the documented DELETE example.
INSERT INTO budget (id, term_beginning, term_end)
     VALUES (20310101, '2031-01-01', '2031-01-31');

COMMIT;
