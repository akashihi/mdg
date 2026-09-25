const pactum = require('pactum');
const { createTracker } = require('./cleanup');

const tracker = createTracker();

const MISSING_ID = 999999999;

// `category_id` is serialized NON_NULL, so an uncategorized account omits it.
const NO_CATEGORY = { type: 'object', not: { required: ['category_id'] } };

after(async () => {
    await tracker.cleanup();
});

it('Ignores an embedded category that was never saved', async () => {
    const accountID = tracker.account(await pactum.spec('Create Account', {
        '@DATA:TEMPLATE@': 'Account:Expense:V1',
        '@OVERRIDES@': {
            category: { account_type: 'EXPENSE', name: 'Never saved', priority: 1 }
        }
    }).returns('id'));

    await pactum.spec('read')
        .get('/accounts/{id}')
        .withPathParams('id', accountID)
        .expectJsonSchema(NO_CATEGORY);
});

it('Ignores an embedded category naming a row that does not exist', async () => {
    const accountID = tracker.account(await pactum.spec('Create Account', {
        '@DATA:TEMPLATE@': 'Account:Expense:V1',
        '@OVERRIDES@': {
            category: { id: MISSING_ID, account_type: 'EXPENSE', name: 'Absent', priority: 1 }
        }
    }).returns('id'));

    await pactum.spec('read')
        .get('/accounts/{id}')
        .withPathParams('id', accountID)
        .expectJsonSchema(NO_CATEGORY);
});

it('Ignores an embedded currency naming a row that does not exist', async () => {
    const accountID = tracker.account(await pactum.spec('Create Account', {
        '@DATA:TEMPLATE@': 'Account:Expense:V1',
        '@OVERRIDES@': {
            currency: { id: MISSING_ID, code: 'XXX', name: 'Absent', active: true }
        }
    }).returns('id'));

    await pactum.spec('read')
        .get('/accounts/{id}')
        .withPathParams('id', accountID)
        .expectJson('currency_id', 978);
});

it('Files the account under category_id, not under an embedded category', async () => {
    const categoryID = tracker.category(await pactum.spec('Create Category', { '@DATA:TEMPLATE@': 'Category:Basic:V1' })
        .returns('id'));

    const accountID = tracker.account(await pactum.spec('Create Account', {
        '@DATA:TEMPLATE@': 'Account:Expense:V1',
        '@OVERRIDES@': {
            category_id: categoryID,
            category: { id: MISSING_ID, account_type: 'EXPENSE', name: 'Absent', priority: 1 }
        }
    }).returns('id'));

    await pactum.spec('read')
        .get('/accounts/{id}')
        .withPathParams('id', accountID)
        .expectJson('category_id', categoryID);
});

it('Ignores an embedded account on a transaction operation', async () => {
    const incomeID = tracker.account(await pactum.spec('Create Account', { '@DATA:TEMPLATE@': 'Account:Income:V1' })
        .returns('id'));
    const expenseID = tracker.account(await pactum.spec('Create Account', { '@DATA:TEMPLATE@': 'Account:Expense:V1' })
        .returns('id'));

    const transactionID = tracker.transaction(await pactum.spec('Create Transaction', {
        timestamp: '2017-02-04T16:45:36',
        comment: 'Embedded account',
        tags: [],
        operations: [
            {
                account_id: incomeID,
                amount: -100,
                account: { id: MISSING_ID, account_type: 'INCOME', currency_id: 978, name: 'Absent' }
            },
            { account_id: expenseID, amount: 100 }
        ]
    }).returns('id'));

    await pactum.spec('read')
        .get('/transactions/{id}')
        .withPathParams('id', transactionID)
        .expectJson('operations[0].account_id', incomeID);
});
