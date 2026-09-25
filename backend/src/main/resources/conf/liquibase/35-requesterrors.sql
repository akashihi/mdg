--liquibase formatted sql

--changeset akashihi:1

INSERT INTO ERROR VALUES('REQUEST_PARAMETER_INVALID', '400', 'Request parameter is invalid', 'A request parameter could not be converted to the type this operation expects, check the specification for its format');
INSERT INTO ERROR VALUES('REQUEST_PARAMETER_MISSING', '400', 'Required request parameter is missing', 'This operation requires a parameter that the request did not carry');
INSERT INTO ERROR VALUES('REQUEST_BODY_INVALID', '400', 'Request body could not be read', 'The request body is not a well formed document of the shape this operation expects');
INSERT INTO ERROR VALUES('REQUEST_METHOD_UNSUPPORTED', '405', 'Method is not supported by this resource', 'The resource exists but does not implement the requested method, see the Allow header for the ones it does');
INSERT INTO ERROR VALUES('REQUEST_MEDIATYPE_UNACCEPTABLE', '406', 'No acceptable representation available', 'This API only produces application/vnd.mdg+json;version=1');
INSERT INTO ERROR VALUES('REQUEST_MEDIATYPE_UNSUPPORTED', '415', 'Media type is not supported', 'This API only consumes application/vnd.mdg+json;version=1');

--rollback DELETE FROM ERROR WHERE CODE IN ('REQUEST_PARAMETER_INVALID', 'REQUEST_PARAMETER_MISSING', 'REQUEST_BODY_INVALID', 'REQUEST_METHOD_UNSUPPORTED', 'REQUEST_MEDIATYPE_UNACCEPTABLE', 'REQUEST_MEDIATYPE_UNSUPPORTED');
