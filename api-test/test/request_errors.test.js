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

describe('Request errors', () => {
    itParam('Non-numeric ${value.name} id is not found', NON_NUMERIC_IDS, async (params) => { // eslint-disable-line no-template-curly-in-string
        await pactum.spec('expect error', { statusCode: 404, code: params.code, instance: params.url })
            .get(params.url);
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

    it('Non-numeric granularity is a request error', async () => {
        await pactum.spec('expect error', { statusCode: 400, code: 'REQUEST_PARAMETER_INVALID' })
            .get('/reports/assets/simple')
            .withQueryParams('startDate', '2017-02-01')
            .withQueryParams('endDate', '2017-02-28')
            .withQueryParams('granularity', 'abc');
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
