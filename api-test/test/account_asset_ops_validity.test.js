const pactum = require('pactum');
const itParam = require('mocha-param');
const { createTracker } = require('./cleanup');

const tracker = createTracker();

after(async () => {
    await tracker.cleanup();
});

const ACCOUNT_FLAGS = ['favorite', 'operational'];

itParam("Can't create non-asset account with ${value} flag set", ACCOUNT_FLAGS, async (params) => { // eslint-disable-line no-template-curly-in-string
    let overrides = {};
    overrides[params] = true;
    await pactum.spec('expect error', { statusCode: 412, code: 'ACCOUNT_NONASSET_INVALIDFLAG' })
        .post('/accounts')
        .withJson({
            '@DATA:TEMPLATE@': 'Account:Expense:V1',
            '@OVERRIDES@':overrides
        });
});

itParam("Can't set ${value} flag on non-asset account", ACCOUNT_FLAGS, async (params) => { // eslint-disable-line no-template-curly-in-string
    const accountID = tracker.account(await pactum.spec('Create Account', { '@DATA:TEMPLATE@': 'Account:Expense:V1' })
        .returns('id'));

    let overrides = {};
    overrides[params] = true;
    await pactum.spec('expect error', { statusCode: 412, code: 'ACCOUNT_NONASSET_INVALIDFLAG' })
        .put('/accounts/{id}')
        .withPathParams('id', accountID)
        .withJson({
            '@DATA:TEMPLATE@': 'Account:Expense:V1',
            '@OVERRIDES@': overrides
        });
});
