const pactum = require('pactum');
const {createAccountForTransaction} = require('./transaction.handler');
const {stash} = require("pactum");


describe('Assets by currency report test', () => {
    const e2e = pactum.e2e('Assets by currency report test');

    it('Prepare accounts', async () => {
        await createAccountForTransaction(e2e);
    });

    it('Force reports re-index', async () => {
        await e2e.step('Force historical balances re index')
            .spec('update')
            .put('/settings/{id}')
            .withPathParams('id', 'mnt.reporting.refresh')
            .withRequestTimeout(15000)
            .expectResponseTime(15000);
    }).timeout(15000);

    it('Get the initial value', async () => {
        await e2e.step('Retrieve pre-transaction report')
            .spec('read')
            .get("/reports/assets/currency?startDate=2017-03-01&endDate=2017-03-15&granularity=1")
            .stores('EurTotals','series[name=EUR].data[0].y')
            .stores('UsdTotals','series[name=USD].data[0].y');
    });

   it('Transaction updates simple report', async () => {
        await e2e.step('Create transaction')
            .spec('Create Transaction', { '@DATA:TEMPLATE@': 'Transaction:Income:V1' });

        await e2e.step('Force historical balances re index')
            .spec('update')
            .put('/settings/{id}')
            .withPathParams('id', 'mnt.reporting.refresh')
            .withRequestTimeout(15000)
            .expectResponseTime(15000);
    }).timeout(15000);

    it('Transaction is reflected in the simple report', async () => {
        const initialEurValue = stash.getDataStore().EurTotals;
        const initialUsdValue = stash.getDataStore().UsdTotals;

        await e2e.step('Retrieve post-transaction report')
            .spec('read')
            .get("/reports/assets/currency?startDate=2017-03-01&endDate=2017-03-15&granularity=1")
            .expectJson('series[name=EUR].data[0].y', initialEurValue + 150)
            .expectJson('series[name=USD].data[0].y', initialUsdValue);

        await e2e.cleanup();
    });
});
