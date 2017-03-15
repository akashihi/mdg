--liquibase formatted sql

--changeset akashihi:1
INSERT INTO ERROR VALUES('BUDGET_DATA_INVALID', '422', 'Budget attributes are invalid', 'Some budget attributes are missing or have invalid values.');
INSERT INTO ERROR VALUES('BUDGET_SHORT_RANGE', '412', 'Budget validity period is too small', 'Budget should be valid for at least one full day.');
INSERT INTO ERROR VALUES('BUDGET_INVALID_TERM', '412', 'Budget validity period is inverted', 'Budget should start before it ends.');

--rollback DELETE FROM ERROR WHERE CODE = 'BUDGET_DATA_INVALID';
--rollback DELETE FROM ERROR WHERE CODE = 'BUDGET_SHORT_RANGE';
--rollback DELETE FROM ERROR WHERE CODE = 'BUDGET_INVALID_TERM';
