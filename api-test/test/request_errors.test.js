const pactum = require('pactum');
const itParam = require('mocha-param');

// Failures that Spring MVC reports before the request reaches a controller. They used
// to come back as a 400 with no body and no content type at all — the only responses in
// the whole API that carried no Problem. Nothing covered them, which is why they were
// only noticed by property-based testing.

// A path id that is not a number can not name an existing resource, so it is answered
// with that resource's own 404 rather than with a generic request error.
const NON_NUMERIC_IDS = [
    { name: 'account', url: '/accounts/abc', code: 'ACCOUNT_NOT_FOUND' },
    { name: 'account status', url: '/accounts/abc/status', code: 'ACCOUNT_NOT_FOUND' },
    { name: 'category', url: '/categories/abc', code: 'CATEGORY_NOT_FOUND' },
    { name: 'currency', url: '/currencies/abc', code: 'CURRENCY_NOT_FOUND' },
    { name: 'transaction', url: '/transactions/abc', code: 'TRANSACTION_NOT_FOUND' },
    { name: 'budget', url: '/budgets/abc', code: 'BUDGET_NOT_FOUND' },
    { name: 'budget entries', url: '/budgets/abc/entries', code: 'BUDGET_NOT_FOUND' },
    { name: 'budget entry', url: '/budgets/20170201/entries/abc', code: 'BUDGETENTRY_NOT_FOUND' },
    { name: 'budget cashflow report', url: '/reports/budget/cashflow/abc', code: 'BUDGET_NOT_FOUND' }
];

// A literal path that its sibling `{id}` mapping also matches. Spring routes PUT and
// DELETE to the instance handler, so `OPTIONS` advertises them and the specification has to
// declare them; the segment is not a number, so each one is the 404 above before any service
// is reached. Nothing here deletes anything.
const SHADOWED_LITERAL_PATHS = [
    { name: 'PUT /accounts/tree', method: 'put', url: '/accounts/tree', code: 'ACCOUNT_NOT_FOUND' },
    { name: 'DELETE /accounts/tree', method: 'delete', url: '/accounts/tree', code: 'ACCOUNT_NOT_FOUND' },
    { name: 'PUT /budgets/current', method: 'put', url: '/budgets/current', code: 'BUDGET_NOT_FOUND' },
    { name: 'DELETE /budgets/current', method: 'delete', url: '/budgets/current', code: 'BUDGET_NOT_FOUND' },
    { name: 'PUT /budgets/{budgetId}/entries/tree', method: 'put', url: '/budgets/20170201/entries/tree', code: 'BUDGETENTRY_NOT_FOUND' }
];

const ZERO_LIMIT_CURSOR = 'eyJsaW1pdCI6MH0=';
const GOOD_CURSOR = 'eyJsaW1pdCI6MywicG9pbnRlciI6N30=';

const BAD_LIMITS = [
    { name: 'zero limit on transactions', url: '/transactions?limit=0', instance: '/transactions' },
    { name: 'negative limit on transactions', url: '/transactions?limit=-1', instance: '/transactions' },
    { name: 'zero limit on budgets', url: '/budgets?limit=0', instance: '/budgets' },
    { name: 'negative limit on budgets', url: '/budgets?limit=-1', instance: '/budgets' },
    { name: 'zero limit inside a transactions cursor', url: `/transactions?cursor=${ZERO_LIMIT_CURSOR}`, instance: '/transactions' },
    { name: 'zero limit inside a budgets cursor', url: `/budgets?cursor=${ZERO_LIMIT_CURSOR}`, instance: '/budgets' },
    { name: 'zero limit next to a transactions cursor', url: `/transactions?limit=0&cursor=${GOOD_CURSOR}`, instance: '/transactions' },
    { name: 'zero limit next to a budgets cursor', url: `/budgets?limit=0&cursor=${GOOD_CURSOR}`, instance: '/budgets' },
    { name: 'empty limit on transactions', url: '/transactions?limit=', instance: '/transactions' },
    { name: 'empty limit on budgets', url: '/budgets?limit=', instance: '/budgets' },
    { name: 'repeated limit on transactions', url: '/transactions?limit=3&limit=4', instance: '/transactions' },
    { name: 'repeated limit on budgets', url: '/budgets?limit=3&limit=4', instance: '/budgets' },
    { name: 'repeated limit with an empty first value on transactions', url: '/transactions?limit=&limit=3', instance: '/transactions' },
    { name: 'repeated limit with an empty first value on budgets', url: '/budgets?limit=&limit=3', instance: '/budgets' }
];

const BAD_GRANULARITIES = [
    { name: 'simple asset report', instance: '/reports/assets/simple' },
    { name: 'asset report by currency', instance: '/reports/assets/currency' },
    { name: 'asset report by type', instance: '/reports/assets/type' },
    { name: 'income events report', instance: '/reports/income/events' },
    { name: 'expense events report', instance: '/reports/expense/events' }
];

// PostgreSQL refuses U+0000 in a text column, so a NUL anywhere in a string used to reach the
// insert and come back as a 500. It is now refused while the body is read. Nothing here creates
// a row: the body is rejected before it reaches a service.
const NUL_BODIES = [
    { name: 'account name', method: 'post', url: '/accounts', body: { account_type: 'EXPENSE', currency_id: 978, name: '\u0000' } },
    { name: 'category name', method: 'post', url: '/categories', body: { account_type: 'EXPENSE', name: 'a\u0000b', priority: 1 } },
    { name: 'transaction comment', method: 'post', url: '/transactions', body: { timestamp: '2017-02-04T16:45:36', comment: '\u0000', operations: [] } },
    { name: 'transaction tag', method: 'post', url: '/transactions', body: { timestamp: '2017-02-04T16:45:36', tags: ['\u0000'], operations: [] } },
    { name: 'setting value', method: 'put', url: '/settings/ui.language', body: { id: 'ui.language', value: '\u0000' } }
];

// Jackson used to convert a scalar of the wrong JSON type rather than refuse it, so a property
// the specification types as a string took a number, one typed as a date took an integer — read
// as days since the epoch, which turned -43115 into a perfectly plausible 1851-12-16 — and an
// integer property took a string. Every one of them answered 201. They are now refused while the
// body is read, so nothing here creates a row either.
const WRONG_TYPE_BODIES = [
    { name: 'a date given as an integer', method: 'post', url: '/budgets', body: { term_beginning: '2031-03-01', term_end: -43115 } },
    { name: 'a date given as an array', method: 'post', url: '/budgets', body: { term_beginning: [1970, 1, 1], term_end: [1970, 1, 2] } },
    { name: 'a date-time given as an array', method: 'post', url: '/transactions', body: { timestamp: [2020, 1, 1, 0, 0], operations: [] } },
    { name: 'a string given as a number', method: 'post', url: '/accounts', body: { account_type: 'expense', currency_id: 978, name: 42 } },
    { name: 'a string given as a boolean', method: 'post', url: '/accounts', body: { account_type: 'expense', currency_id: 978, name: false } },
    { name: 'a tag given as a number', method: 'post', url: '/transactions', body: { timestamp: '2017-02-04T16:45:36', tags: [42], operations: [] } },
    { name: 'a setting value given as a number', method: 'put', url: '/settings/ui.language', body: { id: 'ui.language', value: 42 } },
    { name: 'an integer given as a string', method: 'post', url: '/accounts', body: { account_type: 'expense', currency_id: '978', name: 'Probe' } },
    // Fractional only. A whole float is a valid integer — the test below this table covers that
    { name: 'an integer given as a fractional float', method: 'post', url: '/accounts', body: { account_type: 'expense', currency_id: 978.5, name: 'Probe' } },
    { name: 'an integer given as an empty string', method: 'post', url: '/accounts', body: { account_type: 'expense', currency_id: 978, name: 'Probe', category_id: '' } },
    { name: 'a boolean given as a string', method: 'post', url: '/accounts', body: { account_type: 'asset', currency_id: 978, name: 'Probe', favorite: 'true' } },
    { name: 'a boolean given as a number', method: 'post', url: '/accounts', body: { account_type: 'asset', currency_id: 978, name: 'Probe', favorite: 1 } },
    { name: 'an enum given as its ordinal', method: 'post', url: '/accounts', body: { account_type: 0, currency_id: 978, name: 'Probe' } },
    { name: 'an amount given as a string', method: 'post', url: '/transactions', body: { timestamp: '2017-02-04T16:45:36', operations: [{ account_id: 1, amount: '100' }] } }
];

// An optional property may be left out, but its schema still does not admit null. Jackson used to
// read an explicit null like an absent value on a nullable Kotlin property, and as 0 or false on a
// primitive one, so every one of these answered 2xx. Nothing here creates or changes a row.
const NULL_BODIES = [
    { name: 'category parent', method: 'post', url: '/categories', body: { account_type: 'EXPENSE', name: 'Bonuses', parent_id: null, priority: 1 } },
    { name: 'category priority', method: 'put', url: '/categories/5', body: { account_type: 'EXPENSE', id: 2, name: 'Pet expenses', parent_id: 1, priority: null } },
    { name: 'budget id', method: 'put', url: '/budgets/20170205', body: { id: null, term_beginning: '2017-02-04', term_end: '2017-02-26' } },
    { name: 'currency active flag', method: 'put', url: '/currencies/978', body: { active: null, code: 'EUR', id: 978, name: '\u20ac' } }
];

const UNPARSEABLE_FILTERS = [
    { name: 'accounts', url: '/accounts' },
    { name: 'the account tree', url: '/accounts/tree' },
    { name: 'transactions', url: '/transactions' }
];

const UNPARSEABLE_FILTER_VALUES = ['null', 'fail', '123', '"a string"', 'true'];

describe('Request errors', () => {
    itParam('Non-numeric ${value.name} id is not found', NON_NUMERIC_IDS, async (params) => { // eslint-disable-line no-template-curly-in-string
        await pactum.spec('expect error', { statusCode: 404, code: params.code, instance: params.url })
            .get(params.url);
    });

    itParam('${value.name} is a shadowed literal path and is not found', SHADOWED_LITERAL_PATHS, async (params) => { // eslint-disable-line no-template-curly-in-string
        const spec = pactum.spec('expect error', { statusCode: 404, code: params.code, instance: params.url })[params.method](params.url);
        if (params.method === 'put') {
            spec.withJson({});
        }
        await spec;
    });

    // A rate timestamp is a moment in time rather than a resource id, so an unparseable
    // one stays a request error instead of becoming a 404.
    it('Unparseable rate timestamp is a request error', async () => {
        await pactum.spec('expect error', { statusCode: 400, code: 'REQUEST_PARAMETER_INVALID' })
            .get('/rates/abc');
    });

    it('Non-numeric limit is a request error', async () => {
        await pactum.spec('expect error', { statusCode: 400, code: 'REQUEST_PARAMETER_INVALID' })
            .get('/transactions')
            .withQueryParams('limit', 'abc');
    });

    itParam('A ${value.name} is a request error', BAD_LIMITS, async (params) => { // eslint-disable-line no-template-curly-in-string
        await pactum.spec('expect error', { statusCode: 400, code: 'REQUEST_PARAMETER_INVALID', instance: params.instance })
            .get(params.url);
    });

    it('Non-numeric granularity is a request error', async () => {
        await pactum.spec('expect error', { statusCode: 400, code: 'REQUEST_PARAMETER_INVALID' })
            .get('/reports/assets/simple')
            .withQueryParams('startDate', '2017-02-01')
            .withQueryParams('endDate', '2017-02-28')
            .withQueryParams('granularity', 'abc');
    });

    itParam('Negative granularity on the ${value.name} is a request error', BAD_GRANULARITIES, async (params) => { // eslint-disable-line no-template-curly-in-string
        await pactum.spec('expect error', { statusCode: 400, code: 'REQUEST_PARAMETER_INVALID', instance: params.instance })
            .get(params.instance)
            .withQueryParams('startDate', '2017-02-01')
            .withQueryParams('endDate', '2017-02-28')
            .withQueryParams('granularity', '-1');
    });

    itParam('An unparseable filter on ${value.name} is ignored', UNPARSEABLE_FILTERS, async (params) => { // eslint-disable-line no-template-curly-in-string
        for (const filter of UNPARSEABLE_FILTER_VALUES) {
            await pactum.spec()
                .get(params.url)
                .withQueryParams('q', filter)
                .expectStatus(200)
                .expectHeader('content-type', 'application/vnd.mdg+json;version=1');
        }
    });

    it('Missing required parameter is reported', async () => {
        await pactum.spec('expect error', { statusCode: 400, code: 'REQUEST_PARAMETER_MISSING' })
            .get('/reports/assets/simple')
            .withQueryParams('endDate', '2017-02-28')
            .withQueryParams('granularity', '1');
    });

    it('Unreadable request body is reported', async () => {
        await pactum.spec('expect error', { statusCode: 400, code: 'REQUEST_BODY_INVALID' })
            .post('/accounts')
            .withBody('{nope');
    });

    itParam('A NUL character in ${value.name} is a request body error', NUL_BODIES, async (params) => { // eslint-disable-line no-template-curly-in-string
        await pactum.spec('expect error', { statusCode: 400, code: 'REQUEST_BODY_INVALID', instance: params.url })[params.method](params.url)
            .withJson(params.body);
    });

    itParam('A body with ${value.name} is a request body error', WRONG_TYPE_BODIES, async (params) => { // eslint-disable-line no-template-curly-in-string
        await pactum.spec('expect error', { statusCode: 400, code: 'REQUEST_BODY_INVALID', instance: params.url })[params.method](params.url)
            .withJson(params.body);
    });

    itParam('A null ${value.name} is a request body error', NULL_BODIES, async (params) => { // eslint-disable-line no-template-curly-in-string
        await pactum.spec('expect error', { statusCode: 400, code: 'REQUEST_BODY_INVALID', instance: params.url })[params.method](params.url)
            .withJson(params.body);
    });

    it('Unknown budget entry copy mode is a request error', async () => {
        await pactum.spec('expect error', { statusCode: 400, code: 'REQUEST_PARAMETER_INVALID', instance: '/budgets/20170206/entries/copy/OVERWRITE/20170206' })
            .put('/budgets/20170206/entries/copy/OVERWRITE/20170206');
    });

    // The other side of that rule, and the reason it needs a deserializer rather than a coercion
    // setting: JSON has one number type, so `type: integer` covers any number with a zero
    // fractional part. 978.0 is a currency id, 978.5 is not.
    it('A whole float is still an integer', async () => {
        await pactum.spec()
            .post('/accounts')
            .withHeaders('Content-Type', 'application/vnd.mdg+json;version=1')
            .withJson({ account_type: 'expense', currency_id: 978.0, name: 'Whole float account' })
            .expectStatus(201)
            .expectJson('currency_id', 978)
            .stores('WholeFloatAccountID', 'id');

        await pactum.spec()
            .delete('/accounts/{id}')
            .withPathParams('id', '$S{WholeFloatAccountID}')
            .expectStatus(204);
    });

    // The only place in the suite that sends a media type this API does not consume.
    it('Unsupported media type is reported', async () => {
        await pactum.spec()
            .post('/accounts')
            .withHeaders('Content-Type', 'application/json')
            .withBody('{}')
            .expectStatus(415)
            .expectHeader('content-type', 'application/vnd.mdg+json;version=1')
            .expectJson('code', 'REQUEST_MEDIATYPE_UNSUPPORTED');
    });

    it('Unsupported method is reported', async () => {
        await pactum.spec('expect error', { statusCode: 405, code: 'REQUEST_METHOD_UNSUPPORTED' })
            .delete('/accounts');
    });

    it('Unacceptable media type is reported', async () => {
        await pactum.spec()
            .get('/accounts')
            .withHeaders('Accept', 'application/xml')
            .expectStatus(406)
            .expectHeader('content-type', 'application/vnd.mdg+json;version=1')
            .expectJson('code', 'REQUEST_MEDIATYPE_UNACCEPTABLE');
    });
});
