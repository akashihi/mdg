--liquibase formatted sql

--changeset akashihi:1
CREATE TABLE CATEGORY(
    ID BIGSERIAL PRIMARY KEY,
    ACCOUNT_TYPE VARCHAR(7) NOT NULL CHECK(ACCOUNT_TYPE IN ('asset', 'expense', 'income')),
    NAME TEXT NOT NULL,
    PRIORITY INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE CATEGORY_TREE (
    ANCESTOR BIGINT NOT NULL REFERENCES CATEGORY(ID) ON DELETE CASCADE,
    DESCENDANT BIGINT NOT NULL REFERENCES CATEGORY(ID) ON DELETE CASCADE,
    DEPTH INTEGER NOT NULL
);

ALTER TABLE ACCOUNT ADD COLUMN CATEGORY_ID BIGINT NOT NULL REFERENCES CATEGORY(ID) ON DELETE RESTRICT;

--rollback DROP TABLE CATEGORY;
--rollback DROP TABLE CATEGORY_TREE;
--rollback ALTER TABLE ACCOUNT DROP COLUMN CATEGORY_ID;

--changeset akashihi:2
INSERT INTO ERROR VALUES('CATEGORY_DATA_INVALID', '412', 'Category attributes are invalid', 'Some category attributes are missing or have invalid values.');

--rollback DELETE FROM ERROR WHERE CODE='CATEGORY_DATA_INVALID'

--changeset akashihi:3
INSERT INTO ERROR VALUES('CATEGORY_NOT_FOUND', '404', 'Requested category could not be found', 'We can not find category with specified code in the database, check it''s id please.');

--rollback DELETE FROM ERROR WHERE CODE='CATEGORY_NOT_FOUND'

--changeset akashihi:4
INSERT INTO ERROR VALUES('CATEGORY_INVALID_TYPE', '412', 'Category can''t be a leaf of a different type', 'Categories can only form trees of a same account types. Categories with different account types can not be attached to the same tree');

--rollback DELETE FROM ERROR WHERE CODE='CATEGORY_INVALID_TYPE'

--changeset akashihi:5
INSERT INTO ERROR VALUES('CATEGORY_TREE_CYCLED', '412', 'Repareting will cause cyclic dependency', 'Category is going to be reparented to one of it''s descendats, that will result in cycle in a tree');

--rollback DELETE FROM ERROR WHERE CODE='CATEGORY_TREE_CYCLED'
