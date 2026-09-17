const pactum = require('pactum');
const { createAccountForTransaction, createUSDAccountForTransaction } = require('./transaction.handler');
const { createTracker } = require('./cleanup');


const tracker = createTracker();

after(async () => {
    await tracker.cleanup();
});

async function prepareAccounts (withUsd) {
    await createAccountForTransaction();
    tracker.accountsFromStore('IncomeAccountID', 'AssetAccountID', 'ExpenseAccountID');
    if (withUsd) {
        await createUSDAccountForTransaction();
        tracker.accountsFromStore('AssetUSDAccountID');
    }
}

it('Empty transactions are not allowed', async () => {
    await prepareAccounts(false);

    // No way to remove field from the template
    await pactum.spec('expect error', { statusCode: 412, code: 'TRANSACTION_EMPTY' })
        .post('/transactions')
        .withJson({
            timestamp: '2017-02-04T16:45:36',
            comment: 'Test transaction',
            tags: [
                'test',
                'transaction'
            ],
            operations: []
        });
});

it('Empty operations are ignored', async () => {
    await prepareAccounts(false);

    await pactum.spec('expect error', { statusCode: 412, code: 'TRANSACTION_EMPTY' })
        .post('/transactions')
        .withJson({
            '@DATA:TEMPLATE@': 'Transaction:Rent:V1',
            '@OVERRIDES@': {
                operations: [
                    {
                        amount: 0
                    },
                    {
                        amount: 0
                    },
                    {
                        amount: 0
                    }
                ]
            }
        });
});

it('Unbalanced transactions are not allowed', async () => {
    await prepareAccounts(false);

    await pactum.spec('expect error', { statusCode: 412, code: 'TRANSACTION_NOT_BALANCED' })
        .post('/transactions')
        .withJson({
            '@DATA:TEMPLATE@': 'Transaction:Rent:V1',
            '@OVERRIDES@': {
                operations: [
                    {
                        amount: -50
                    },
                    {
                        amount: 100
                    },
                    {
                        amount: 25
                    }
                ]
            }
        });
});

it('Multi currency transaction without rate are not allowed', async () => {
    await prepareAccounts(true);

    // No way to remove field from the template
    await pactum.spec('expect error', { statusCode: 412, code: 'TRANSACTION_AMBIGUOUS_RATE' })
        .post('/transactions')
        .withJson({
            timestamp: '2017-02-05T13:54:35',
            comment: 'Test transaction',
            tags: [
                'test',
                'transaction'
            ],
            operations: [
                {
                    account_id: '$S{AssetAccountID}',
                    amount: -100
                },
                {
                    account_id: '$S{AssetUSDAccountID}',
                    amount: 200
                }
            ]
        });
});

it('Multi currency transaction with rate set to all operations are not allowed', async () => {
    await prepareAccounts(true);

    // No way to remove field from the template
    await pactum.spec('expect error', { statusCode: 412, code: 'TRANSACTION_NO_DEFAULT_RATE' })
        .post('/transactions')
        .withJson({
            '@DATA:TEMPLATE@': 'Transaction:MultiCurrency:V1',
            '@OVERRIDES@': {
                operations: [
                    {
                        rate: 3
                    }
                ]
            }
        });
});

it('Multi currency transaction with default rate on different currencies are not allowed', async () => {
    await prepareAccounts(true);

    // No way to remove field from the template
    await pactum.spec('expect error', { statusCode: 412, code: 'TRANSACTION_AMBIGUOUS_RATE' })
        .post('/transactions')
        .withJson({
            '@DATA:TEMPLATE@': 'Transaction:MultiCurrency:V1',
            '@OVERRIDES@': {
                operations: [
                    {
                    },
                    {
                        rate: 1 // The upper operation has no rate (=default rate) and this is forced to default rate value too
                    }
                ]
            }
        });
});

it('Multi currency transaction with 0 rate is not allowed', async () => {
    await prepareAccounts(true);

    // No way to remove field from the template
    await pactum.spec('expect error', { statusCode: 412, code: 'TRANSACTION_ZERO_RATE' })
        .post('/transactions')
        .withJson({
            '@DATA:TEMPLATE@': 'Transaction:MultiCurrency:V1',
            '@OVERRIDES@': {
                operations: [
                    {
                    },
                    {
                        rate: 0
                    }
                ]
            }
        });
});

it('Unbalanced multi currency transactions are not allowed', async () => {
    await prepareAccounts(true);

    // No way to remove field from the template
    await pactum.spec('expect error', { statusCode: 412, code: 'TRANSACTION_NOT_BALANCED' })
        .post('/transactions')
        .withJson({
            '@DATA:TEMPLATE@': 'Transaction:MultiCurrency:V1',
            '@OVERRIDES@': {
                operations: [
                    {
                        amount: -120
                    }
                ]
            }
        });
});

it('Operations without an account are not allowed', async () => {
    await prepareAccounts(false);

    await pactum.spec('expect error', { statusCode: 422, code: 'TRANSACTION_DATA_INVALID', instance: '/transactions' })
        .post('/transactions')
        .withJson({
            timestamp: '2017-02-04T16:45:36',
            comment: 'Test transaction',
            tags: [],
            operations: [
                {
                    amount: -100
                },
                {
                    account_id: '$S{AssetAccountID}',
                    amount: 100
                }
            ]
        });
});

it('An explicitly null account on an operation is not allowed', async () => {
    await prepareAccounts(false);

    await pactum.spec('expect error', { statusCode: 422, code: 'TRANSACTION_DATA_INVALID', instance: '/transactions' })
        .post('/transactions')
        .withJson({
            timestamp: '2017-02-04T16:45:36',
            comment: 'Test transaction',
            tags: [],
            operations: [
                {
                    account_id: null,
                    amount: -100
                }
            ]
        });
});

it('Operations without an account are not allowed on update either', async () => {
    await prepareAccounts(false);

    const txID = tracker.transaction(await pactum.spec('Create Transaction', { '@DATA:TEMPLATE@': 'Transaction:Rent:V1' })
        .returns('id'));

    await pactum.spec('expect error', { statusCode: 422, code: 'TRANSACTION_DATA_INVALID' })
        .put('/transactions/{id}')
        .withPathParams('id', txID)
        .withJson({
            timestamp: '2017-02-04T16:45:36',
            comment: 'Test transaction',
            tags: [],
            operations: [
                {
                    amount: -100
                }
            ]
        });
});

it('A null operation is not allowed', async () => {
    await prepareAccounts(false);

    await pactum.spec('expect error', { statusCode: 422, code: 'TRANSACTION_DATA_INVALID', instance: '/transactions' })
        .post('/transactions')
        .withJson({
            timestamp: '2017-02-04T16:45:36',
            comment: 'Test transaction',
            tags: [],
            operations: [
                null,
                {
                    account_id: '$S{AssetAccountID}',
                    amount: 100
                }
            ]
        });
});

it('A null tag is not allowed', async () => {
    await prepareAccounts(false);

    await pactum.spec('expect error', { statusCode: 422, code: 'TRANSACTION_DATA_INVALID', instance: '/transactions' })
        .post('/transactions')
        .withJson({
            timestamp: '2017-02-04T16:45:36',
            comment: 'Test transaction',
            tags: ['test', null],
            operations: [
                {
                    account_id: '$S{IncomeAccountID}',
                    amount: -100
                },
                {
                    account_id: '$S{AssetAccountID}',
                    amount: 100
                }
            ]
        });
});

it('A null tag is not allowed on update', async () => {
    await prepareAccounts(false);
    const transactionID = await pactum.spec('Create Transaction', { '@DATA:TEMPLATE@': 'Transaction:Income:V1' })
        .returns('id');
    tracker.transaction(transactionID);

    await pactum.spec('expect error', { statusCode: 422, code: 'TRANSACTION_DATA_INVALID' })
        .put('/transactions/{id}')
        .withPathParams('id', transactionID)
        .withJson({
            timestamp: '2017-02-04T16:45:36',
            comment: 'Test transaction',
            tags: [null],
            operations: [
                {
                    account_id: '$S{IncomeAccountID}',
                    amount: -100
                },
                {
                    account_id: '$S{AssetAccountID}',
                    amount: 100
                }
            ]
        });
});
