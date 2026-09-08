const pactum = require('pactum');
const {createAccountForTransaction} = require('./transaction.handler');
const {stash} = require('pactum');

describe('Budget entry transaction date handling', () => {
    const e2e = pactum.e2e('Budget entry transaction date handling');

    after(async () => {
        await e2e.cleanup();
    });

    it('Prepare budget and accounts', async () => {
        await createAccountForTransaction(e2e);
        await e2e.step('Post budget')
            .spec('Create Budget', {'@DATA:TEMPLATE@': 'Budget:Feb:V1'})
            .stores('BudgetID', 'id')
            .clean()
            .delete('/budgets/{id}')
            .withPathParams('id', '$S{BudgetID}');
    });

    it('Retrieve entry id', async () => {
        await e2e.step('List budget entries')
            .spec('read')
            .get('/budgets/{id}/entries')
            .withPathParams('id', '$S{BudgetID}')
            .expect(ctx => {
                const expenseAccountID = stash.getDataStore().ExpenseAccountID;
                const entry = ctx.res.json.budget_entries.find(e => e.account_id === expenseAccountID);
                if (!entry) {
                    throw new Error('No budget entry for the expense account ' + expenseAccountID);
                }
                stash.addDataStore({ BudgetEntryID: entry.id, BudgetEntryAccountID: entry.account_id });
            });
    });

    it('Set dt for entry', async () => {
        await e2e.step('Update budget entry')
            .spec('update')
            .put('/budgets/{id}/entries/{entryId}')
            .withPathParams({id: '$S{BudgetID}', entryId: '$S{BudgetEntryID}'})
            .withJson({
                id: '$S{BudgetEntryID}',
                account_id: '$S{BudgetEntryAccountID}',
                distribution: 'SINGLE',
                dt: "2017-02-15",
                expected_amount: 9000,
                actual_amount: 150
            })
            .expectJson('expected_amount', 9000);

        await e2e.step('Read budget entry')
            .spec('read')
            .get('/budgets/{id}/entries/{entryId}')
            .withPathParams({id: '$S{BudgetID}', entryId: '$S{BudgetEntryID}'})
            .expectJson('distribution', "SINGLE")
            .expectJson('dt', "2017-02-15");
    });

    it('Drop dt on entry', async () => {
        await e2e.step('Update budget entry')
            .spec('update')
            .put('/budgets/{id}/entries/{entryId}')
            .withPathParams({id: '$S{BudgetID}', entryId: '$S{BudgetEntryID}'})
            .withJson({
                id: '$S{BudgetEntryID}',
                account_id: '$S{BudgetEntryAccountID}',
                distribution: 'SINGLE',
                expected_amount: 9000,
                actual_amount: 150
            })
            .expectJson('expected_amount', 9000);

        await e2e.step('Read budget entry')
            .spec('read')
            .get('/budgets/{id}/entries/{entryId}')
            .withPathParams({id: '$S{BudgetID}', entryId: '$S{BudgetEntryID}'})
            .expectJson('distribution', "SINGLE")
            .expect(ctx => {
                if ("dt" in ctx.res.json) {
                    throw new Error('DT field still present on BudgetEntry object');
                }
            });
    });

    it('DT on non-single is non-settable', async () => {
        await e2e.step('Update budget entry')
            .spec('update')
            .put('/budgets/{id}/entries/{entryId}')
            .withPathParams({id: '$S{BudgetID}', entryId: '$S{BudgetEntryID}'})
            .withJson({
                id: '$S{BudgetEntryID}',
                account_id: '$S{BudgetEntryAccountID}',
                distribution: 'EVEN',
                dt: "2017-02-15",
                expected_amount: 9000,
                actual_amount: 150
            })
            .expectJson('expected_amount', 9000);

        await e2e.step('Read budget entry')
            .spec('read')
            .get('/budgets/{id}/entries/{entryId}')
            .withPathParams({id: '$S{BudgetID}', entryId: '$S{BudgetEntryID}'})
            .expectJson('distribution', "EVEN")
            .expect(ctx => {
                if ("dt" in ctx.res.json) {
                    throw new Error('DT field still present on BudgetEntry object');
                }
            });
    });

    it('DT removed on distribution switch', async () => {
        await e2e.step('Update budget entry')
            .spec('update')
            .put('/budgets/{id}/entries/{entryId}')
            .withPathParams({id: '$S{BudgetID}', entryId: '$S{BudgetEntryID}'})
            .withJson({
                id: '$S{BudgetEntryID}',
                account_id: '$S{BudgetEntryAccountID}',
                distribution: 'SINGLE',
                dt: "2017-02-15",
                expected_amount: 9000,
                actual_amount: 150
            })
            .expectJson('expected_amount', 9000);

        await e2e.step('Read budget entry')
            .spec('read')
            .get('/budgets/{id}/entries/{entryId}')
            .withPathParams({id: '$S{BudgetID}', entryId: '$S{BudgetEntryID}'})
            .expectJson('distribution', "SINGLE")
            .expectJson('dt', "2017-02-15");

        await e2e.step('Update budget entry')
            .spec('update')
            .put('/budgets/{id}/entries/{entryId}')
            .withPathParams({id: '$S{BudgetID}', entryId: '$S{BudgetEntryID}'})
            .withJson({
                id: '$S{BudgetEntryID}',
                account_id: '$S{BudgetEntryAccountID}',
                distribution: 'PRORATED',
                dt: "2017-02-15",
                expected_amount: 9000,
                actual_amount: 150
            })
            .expectJson('expected_amount', 9000);

        await e2e.step('Read budget entry')
            .spec('read')
            .get('/budgets/{id}/entries/{entryId}')
            .withPathParams({id: '$S{BudgetID}', entryId: '$S{BudgetEntryID}'})
            .expectJson('distribution', "PRORATED")
            .expect(ctx => {
                if ("dt" in ctx.res.json) {
                    throw new Error('DT field still present on BudgetEntry object');
                }
            });
    });
});
