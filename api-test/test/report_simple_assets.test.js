const pactum = require('pactum');
const {createAccountForTransaction} = require('./transaction.handler');
const {stash} = require("pactum");


describe('Simple assets report test', () => {
    const e2e = pactum.e2e('Totals report test');

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
            .get("/reports/assets/simple?startDate=2017-03-01&endDate=2017-03-15&granularity=1")
            .stores('Totals','series[0].data[0].y');
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
        const initialValue = stash.getDataStore().Totals;

        await e2e.step('Retrieve post-transaction report')
            .spec('read')
            .get("/reports/assets/simple?startDate=2017-03-01&endDate=2017-03-15&granularity=1")
            .expectJson('series[0].data[0].y', initialValue + 150);

        await e2e.cleanup();
    });
});
