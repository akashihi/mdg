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
            .expectJsonMatch("report.category_name", notIncludes("Debt"))

        await e2e.step('Create multi-currency transaction')
            .spec('Create Transaction', { '@DATA:TEMPLATE@': 'Transaction:CZK:V1' })
            .stores('TransactionID', 'id')
            .clean()
            .delete("/transactions/{id}")
            .withPathParams("id", "${CZKAccountID}")

        await e2e.step('Check that transactions on assets are reported in totals report')
            .spec('read')
            .get("/reports/totals")
            .expectJsonMatch("report[category_name=Debt].amounts[name=CZK].amount", 2500)

        await e2e.cleanup();
    });


/*    it('Get entries ids', async () => {
        await e2e.step('List budget entries')
            .spec('read')
            .get('/budgets/{id}/entries')
            .withPathParams('id', '$S{BudgetSourceID}')
            .stores('SourceEntries', 'budget_entries');

        await e2e.step('List budget entries')
            .spec('read')
            .get('/budgets/{id}/entries')
            .withPathParams('id', '$S{BudgetTargetID}')
            .stores('TargetEntries', 'budget_entries');

        const incomeAccountId = stash.getDataStore().IncomeAccountID;
        const expenseAccountId = stash.getDataStore().ExpenseAccountID;

        const sourceIncomeEntryId = stash.getDataStore().SourceEntries.filter(item => item.account_id === incomeAccountId).map(item => item.id)[0];
        const sourceExpenseEntryId = stash.getDataStore().SourceEntries.filter(item => item.account_id === expenseAccountId).map(item => item.id)[0];

        const targetIncomeEntryId = stash.getDataStore().TargetEntries.filter(item => item.account_id === incomeAccountId).map(item => item.id)[0];
        const targetExpenseEntryId = stash.getDataStore().TargetEntries.filter(item => item.account_id === expenseAccountId).map(item => item.id)[0];

        stash.getDataStore().SourceIncomeEntryId = sourceIncomeEntryId;
        stash.getDataStore().SourceExpenseEntryId = sourceExpenseEntryId;
        stash.getDataStore().TargetIncomeEntryId = targetIncomeEntryId;
        stash.getDataStore().TargetExpenseEntryId = targetExpenseEntryId;
    });

    it('Update budget entries before copying', async () => {
        await e2e.step('Update income source entry')
            .spec('update')
            .put('/budgets/{id}/entries/{entryId}')
            .withPathParams({id: '$S{BudgetSourceID}', entryId: '$S{SourceIncomeEntryId}'})
            .withJson({
                id: '$S{SourceIncomeEntryId}',
                account_id: '$S{IncomeAccountID}',
                distribution: 'PRORATED',
                expected_amount: 9000,
                actual_amount: 150
            })
            .expectJson('expected_amount', 9000);

        await e2e.step('Update expense source entry')
            .spec('update')
            .put('/budgets/{id}/entries/{entryId}')
            .withPathParams({id: '$S{BudgetSourceID}', entryId: '$S{SourceExpenseEntryId}'})
            .withJson({
                id: '$S{SourceExpenseEntryId}',
                account_id: '$S{ExpenseAccountID}',
                distribution: 'PRORATED',
                expected_amount: 6000,
                actual_amount: 150
            })
            .expectJson('expected_amount', 6000);

        await e2e.step('Update income target entry')
            .spec('update')
            .put('/budgets/{id}/entries/{entryId}')
            .withPathParams({id: '$S{BudgetTargetID}', entryId: '$S{TargetIncomeEntryId}'})
            .withJson({
                id: '$S{TargetIncomeEntryId}',
                account_id: '$S{IncomeAccountID}',
                distribution: 'EVEN',
                expected_amount: 2000,
                actual_amount: 150
            })
            .expectJson('expected_amount', 2000);
    });

    it('Copy budget values preserving existing', async () => {
        await e2e.step('Copy entries preserving existing')
            .spec('update')
            .put('/budgets/{id}/entries/copy/preserve/{source}')
            .withPathParams({id: '$S{BudgetTargetID}', source: '$S{BudgetSourceID}'})
            .expectStatus(204);

        await e2e.step('Read budget entry')
            .spec('read')
            .get('/budgets/{id}/entries/{entryId}')
            .withPathParams({id: '$S{BudgetTargetID}', entryId: '$S{TargetExpenseEntryId}'})
            .expectJson('expected_amount', 6000);

        await e2e.step('Read budget entry')
            .spec('read')
            .get('/budgets/{id}/entries/{entryId}')
            .withPathParams({id: '$S{BudgetTargetID}', entryId: '$S{TargetIncomeEntryId}'})
            .expectJson('expected_amount', 2000);
    });

    it('Copy budget overwriting values', async () => {
        await e2e.step('Copy entries overwriting existing')
            .spec('update')
            .put('/budgets/{id}/entries/copy/overwrite/{source}')
            .withPathParams({id: '$S{BudgetTargetID}', source: '$S{BudgetSourceID}'})
            .expectStatus(204);

        await e2e.step('Read budget entry')
            .spec('read')
            .get('/budgets/{id}/entries/{entryId}')
            .withPathParams({id: '$S{BudgetTargetID}', entryId: '$S{TargetExpenseEntryId}'})
            .expectJson('expected_amount', 6000);

        await e2e.step('Read budget entry')
            .spec('read')
            .get('/budgets/{id}/entries/{entryId}')
            .withPathParams({id: '$S{BudgetTargetID}', entryId: '$S{TargetIncomeEntryId}'})
            .expectJson('expected_amount', 9000);

        await e2e.cleanup();
    });*/
});
