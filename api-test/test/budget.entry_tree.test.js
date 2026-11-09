const pactum = require('pactum');
const { stash } = require('pactum');
const assert = require('assert');

// The term has to contain today: allowed_spendings of a past budget is always 0,
// which would make it indistinguishable from a zero spending_percent.
function isoDay (offset) {
    const day = new Date();
    day.setDate(day.getDate() + offset);
    return day.toISOString().slice(0, 10);
}

describe('Budget entries tree', () => {
    const e2e = pactum.e2e('Budget entries tree');

    after(async () => {
        await e2e.cleanup();
    });

    it('Prepare category, categorized expense account and budget', async () => {
        await e2e.step('Post category')
            .spec('Create Category', { '@DATA:TEMPLATE@': 'Category:Basic:V1' })
            .stores('CategoryID', 'id')
            .clean()
            .delete('/categories/{id}')
            .withPathParams('id', '$S{CategoryID}');

        await e2e.step('Post categorized account')
            .spec('Create Account', {
                '@DATA:TEMPLATE@': 'Account:Expense:V1',
                '@OVERRIDES@': { category_id: '$S{CategoryID}' }
            })
            .stores('TreeAccountID', 'id')
            .clean()
            .delete('/accounts/{id}')
            .withPathParams('id', '$S{TreeAccountID}');

        await e2e.step('Post budget')
            .spec('Create Budget', {
                term_beginning: isoDay(-2),
                term_end: isoDay(10)
            })
            .stores('TreeBudgetID', 'id')
            .clean()
            .delete('/budgets/{id}')
            .withPathParams('id', '$S{TreeBudgetID}');
    });

    it('Give the categorized account an expected amount', async () => {
        await e2e.step('Find budget entry')
            .spec('read')
            .get('/budgets/{id}/entries')
            .withPathParams('id', '$S{TreeBudgetID}')
            .expect(ctx => {
                const dataStore = stash.getDataStore();
                const entry = ctx.res.json.budget_entries.find(item => item.account_id === dataStore.TreeAccountID);
                assert.ok(entry, 'budget entry of the categorized account not found');
                dataStore.TreeEntryID = entry.id;
            });

        await e2e.step('Update budget entry')
            .spec('update')
            .put('/budgets/{id}/entries/{entryId}')
            .withPathParams({ id: '$S{TreeBudgetID}', entryId: '$S{TreeEntryID}' })
            .withJson({
                id: '$S{TreeEntryID}',
                account_id: '$S{TreeAccountID}',
                distribution: 'PRORATED',
                expected_amount: 1000,
                actual_amount: 0
            })
            .expectJson('expected_amount', 1000);
    });

    it('Expense root carries the totals of its categories, not swapped fields', async () => {
        await e2e.step('Read tree')
            .spec('read')
            .get('/budgets/{id}/entries/tree')
            .withPathParams('id', '$S{TreeBudgetID}')
            .expect(ctx => {
                const root = ctx.res.json.expense;
                assert.strictEqual(root.categories.length, 1);
                const category = root.categories[0];
                // Precondition for a meaningful comparison: the two fields differ
                assert.ok(category.allowed_spendings > 0, 'allowed_spendings should be positive');
                assert.notStrictEqual(category.allowed_spendings, category.spending_percent);
                assert.strictEqual(root.actual_amount, category.actual_amount);
                assert.strictEqual(root.expected_amount, category.expected_amount);
                assert.strictEqual(root.allowed_spendings, category.allowed_spendings);
                assert.strictEqual(root.spending_percent, category.spending_percent);
            });
    });

    it('Income root without categories reports no allowance and a full percent', async () => {
        await e2e.step('Read tree')
            .spec('read')
            .get('/budgets/{id}/entries/tree')
            .withPathParams('id', '$S{TreeBudgetID}')
            .expectJson('income.categories', [])
            .expectJson('income.expected_amount', 0)
            .expectJson('income.allowed_spendings', 0)
            .expectJson('income.spending_percent', 100);
    });
});
