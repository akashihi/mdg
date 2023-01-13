const pactum = require('pactum');
const {createAccountForTransaction} = require('./transaction.handler');
const {stash} = require("pactum");

describe('Budget entries copying', () => {
    const e2e = pactum.e2e('Budget entries copying');

    it('Prepare budgets and accounts', async () => {
        await createAccountForTransaction(e2e);
        await e2e.step('Post Source budget')
            .spec('Create Budget', {'@DATA:TEMPLATE@': 'Budget:Feb:V1'})
            .stores('BudgetSourceID', 'id')
            .clean()
            .delete('/budgets/{id}')
            .withPathParams('id', '$S{BudgetSourceID}');

        await e2e.step('Post Target budget')
            .spec('Create Budget', {'@DATA:TEMPLATE@': 'Budget:Mar:V1'})
            .stores('BudgetTargetID', 'id')
            .clean()
            .delete('/budgets/{id}')
            .withPathParams('id', '$S{BudgetTargetID}');
    });

    it('Get entries ids', async () => {
        await e2e.step('List budget entries')
            .spec('read')
            .get('/budgets/{id}/entries')
            .withPathParams('id', '$S{BudgetSourceID}')
            .stores("SourceEntries", "budget_entries");

        await e2e.step('List budget entries')
            .spec('read')
            .get('/budgets/{id}/entries')
            .withPathParams('id', '$S{BudgetTargetID}')
            .stores("TargetEntries", "budget_entries");

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
    });
});
