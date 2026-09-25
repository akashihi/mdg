const pactum = require('pactum');
const { stash } = require('pactum');

pactum.handler.addSpecHandler('Create Transaction', (ctx) => {
    const { spec, data } = ctx;
    spec.post('/transactions');
    spec.withJson(data);
    spec.use('create');
});

// Registers a delete for an account this helper just created.
//
// The clean goes on the step rather than being chained onto the create spec, so
// the spec's own return value stays intact, and it is registered with the literal
// id rather than $S{key}: several suites call these helpers more than once, which
// overwrites the store key, and a clean written as $S{key} would then resolve to
// the last account for every registration and leave the earlier ones behind.
function cleanAccount (step, storeKey) {
    const id = stash.getDataStore()[storeKey];
    step.clean().delete('/accounts/{id}').withPathParams('id', id);
}

async function createAccountForTransaction (e2e) {
    let firstStep = pactum;
    let secondStep = pactum;
    let thirdStep = pactum;

    if (e2e) {
        firstStep = e2e.step('Prepare income account');
        secondStep = e2e.step('Prepare asset account');
        thirdStep = e2e.step('Prepare expense account');
    }
    await firstStep.spec('Create Account', { '@DATA:TEMPLATE@': 'Account:Income:V1' })
        .stores('IncomeAccountID', 'id');

    await secondStep.spec('Create Account', { '@DATA:TEMPLATE@': 'Account:Asset:V1' })
        .stores('AssetAccountID', 'id');

    await thirdStep.spec('Create Account', { '@DATA:TEMPLATE@': 'Account:Expense:V1' })
        .stores('ExpenseAccountID', 'id');

    if (e2e) {
        cleanAccount(firstStep, 'IncomeAccountID');
        cleanAccount(secondStep, 'AssetAccountID');
        cleanAccount(thirdStep, 'ExpenseAccountID');
    }
}

async function checkAccountsBalances (e2e, income, assets, expense) {
    await e2e.step('Read income account')
        .spec('Validate account balance', { id: '$S{IncomeAccountID}', balance: income });

    await e2e.step('Read asset account')
        .spec('Validate account balance', { id: '$S{AssetAccountID}', balance: assets });

    await e2e.step('Read expense account')
        .spec('Validate account balance', { id: '$S{ExpenseAccountID}', balance: expense });
}

async function createUSDAccountForTransaction (e2e) {
    let usdStep = pactum;

    if (e2e) {
        usdStep = e2e.step('Prepare USD asset account');
    }

    const id = await usdStep
        .spec('Create Account', { '@DATA:TEMPLATE@': 'Account:Asset:USD:V1' })
        .stores('AssetUSDAccountID', 'id')
        .returns('id');

    if (e2e) {
        cleanAccount(usdStep, 'AssetUSDAccountID');
    }

    return id;
}

async function createUSDExpenseAccountForTransaction (e2e) {
    let usdStep = pactum;

    if (e2e) {
        usdStep = e2e.step('Prepare USD expense account');
    }

    const id = await usdStep
        .spec('Create Account', { '@DATA:TEMPLATE@': 'Account:Expense:USD:V1' })
        .stores('ExpenseUSDAccountID', 'id')
        .returns('id');

    if (e2e) {
        cleanAccount(usdStep, 'ExpenseUSDAccountID');
    }

    return id;
}

module.exports = { createAccountForTransaction, checkAccountsBalances, createUSDAccountForTransaction, createUSDExpenseAccountForTransaction };
