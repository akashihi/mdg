--liquibase formatted sql

--changeset akashihi:1

INSERT INTO ERROR VALUES('CURSOR_DATA_INVALID', '422', 'Supplied cursor is invalid', 'The cursor was not issued by this API or has been corrupted, restart paging without it');

--rollback DELETE FROM ERROR WHERE CODE='CURSOR_DATA_INVALID';
