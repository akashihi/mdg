const pactum = require('pactum');
const {createAccountForTransaction} = require('./transaction.handler');
const { notIncludes } = require('pactum-matchers');

describe('Totals report test', () => {
    const e2e = pactum.e2e('Totals report test');

    it('Prepare accounts', async () => {
        await createAccountForTransaction(e2e);
        await e2e.step('Post CZK/Debt accout')
            .spec('Create Account', { '@DATA:TEMPLATE@': 'Account:Asset:CZK:V1' })
            .stores('CZKAccountID', 'id');

        await e2e.step('Check that empty categories are not present in the totals report')
            .spec('read')
            .get("/reports/totals")
            .expectJsonMatch("report.category_name", notIncludes("Debt"));

        await e2e.step('Create multi-currency transaction')
            .spec('Create Transaction', { '@DATA:TEMPLATE@': 'Transaction:CZK:V1' })
            .stores('TransactionID', 'id')
            .clean()
            .delete("/transactions/{id}")
            .withPathParams("id", "$S{CZKAccountID}");

        await e2e.step('Check that transactions on assets are reported in totals report')
            .spec('read')
            .get("/reports/totals")
            .expectJsonMatch("report[category_name=Debt].amounts[name=CZK].amount", 2500);

        await e2e.cleanup();
    });

});
