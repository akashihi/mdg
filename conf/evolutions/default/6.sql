# Budget validation errors

# --- !Ups

INSERT INTO ERROR VALUES('BUDGET_DATA_INVALID', '422', 'Budget attributes are invalid', 'Some budget attributes are missing or have invalid values.');
INSERT INTO ERROR VALUES('BUDGET_SHORT_RANGE', '412', 'Budget validity period is too small', 'Budget should be valid for at least one full day.');
INSERT INTO ERROR VALUES('BUDGET_INVALID_TERM', '412', 'Budget validity period is inverted', 'Budget should start before it ends.');
# --- !Downs
DELETE FROM ERROR WHERE CODE = 'BUDGET_DATA_INVALID';
DELETE FROM ERROR WHERE CODE = 'BUDGET_SHORT_RANGE';
DELETE FROM ERROR WHERE CODE = 'BUDGET_INVALID_TERM';
