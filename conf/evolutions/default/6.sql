# Budget validation errors

# --- !Ups

INSERT INTO ERROR VALUES('BUDGET_DATA_INVALID', '422', 'Budget attributes are invalid', 'Some budget attributes are missing or have invalid values.');
# --- !Downs
DELETE FROM ERROR WHERE CODE = 'BUDGET_DATA_INVALID';
