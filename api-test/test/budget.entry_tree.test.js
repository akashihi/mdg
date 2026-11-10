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

function sum (items, field) {
    return items.reduce((total, item) => total + item[field], 0);
}

function assertClose (actual, expected, message) {
    assert.ok(Math.abs(actual - expected) < 0.01, `${message}: expected ${expected}, got ${actual}`);
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

        await e2e.step('Post uncategorized account')
            .spec('Create Account', {
                '@DATA:TEMPLATE@': 'Account:Expense:V1',
                '@OVERRIDES@': { name: 'Uncategorized tree expense' }
            })
            .stores('TreeUncategorizedAccountID', 'id')
            .clean()
            .delete('/accounts/{id}')
            .withPathParams('id', '$S{TreeUncategorizedAccountID}');

        await e2e.step('Post asset account')
            .spec('Create Account', {
                '@DATA:TEMPLATE@': 'Account:Asset:V1',
                '@OVERRIDES@': { name: 'Tree funding wallet' }
            })
            .stores('TreeAssetAccountID', 'id')
            .clean()
            .delete('/accounts/{id}')
            .withPathParams('id', '$S{TreeAssetAccountID}');

        await e2e.step('Post budget')
            .spec('Create Budget', {
                term_beginning: isoDay(-2),
                term_end: isoDay(10)
            })
            .stores('TreeBudgetID', 'id')
            .clean()
            .delete('/budgets/{id}')
            .withPathParams('id', '$S{TreeBudgetID}');

        // Registered after the budget, so it is cleaned before the accounts it uses.
        // The server computes actual_amount from transactions inside the term.
        // The amount stays below the prorated allowance, so allowed_spendings stays positive.
        await e2e.step('Post spending on the uncategorized account')
            .spec('Create Transaction', {
                timestamp: `${isoDay(0)}T12:00:00`,
                comment: 'Tree uncategorized spending',
                operations: [
                    { account_id: '$S{TreeAssetAccountID}', amount: -10 },
                    { account_id: '$S{TreeUncategorizedAccountID}', amount: 10 }
                ]
            })
            .stores('TreeTransactionID', 'id')
            .clean()
            .delete('/transactions/{id}')
            .withPathParams('id', '$S{TreeTransactionID}');
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

    it('Give the uncategorized account an expected amount', async () => {
        await e2e.step('Find uncategorized budget entry')
            .spec('read')
            .get('/budgets/{id}/entries')
            .withPathParams('id', '$S{TreeBudgetID}')
            .expect(ctx => {
                const dataStore = stash.getDataStore();
                const entry = ctx.res.json.budget_entries.find(item => item.account_id === dataStore.TreeUncategorizedAccountID);
                assert.ok(entry, 'budget entry of the uncategorized account not found');
                dataStore.TreeUncategorizedEntryID = entry.id;
            });

        await e2e.step('Update uncategorized budget entry')
            .spec('update')
            .put('/budgets/{id}/entries/{entryId}')
            .withPathParams({ id: '$S{TreeBudgetID}', entryId: '$S{TreeUncategorizedEntryID}' })
            .withJson({
                id: '$S{TreeUncategorizedEntryID}',
                account_id: '$S{TreeUncategorizedAccountID}',
                distribution: 'PRORATED',
                expected_amount: 400,
                actual_amount: 0
            })
            .expectJson('expected_amount', 400);
    });

    it('Expense root totals cover uncategorized entries and categories, not swapped fields', async () => {
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

                // Our uncategorized entry sits directly under the root, not under the category
                const mine = root.entries.find(item => item.account_id === stash.getDataStore().TreeUncategorizedAccountID);
                assert.ok(mine, 'uncategorized entry is missing from the root entries');
                assert.strictEqual(mine.expected_amount, 400);
                assert.strictEqual(mine.actual_amount, 10);
                assert.ok(mine.allowed_spendings > 0, 'uncategorized allowed_spendings should be positive');
                assert.ok(!category.entries.some(item => item.id === mine.id), 'uncategorized entry leaked into the category');

                // Other uncategorized expense accounts may exist, so sum what the response holds
                for (const field of ['actual_amount', 'expected_amount', 'allowed_spendings']) {
                    assertClose(root[field], sum(root.entries, field) + sum(root.categories, field), `root ${field}`);
                }
                // The root must not be equal to the categories alone any more
                assert.ok(root.expected_amount >= category.expected_amount + 400 - 0.01, 'root ignores uncategorized expected_amount');
                assert.ok(root.actual_amount >= category.actual_amount + 10 - 0.01, 'root ignores uncategorized actual_amount');
                assert.ok(root.allowed_spendings > category.allowed_spendings, 'root ignores uncategorized allowed_spendings');
                // BudgetService.getSpendingPercent: 100 for a zero expectation, otherwise
                // round(actual / expected, 2) * 100 as a whole number, capped at 100
                let expectedPercent = 100;
                if (root.expected_amount !== 0) {
                    const ratio = Math.round(root.actual_amount / root.expected_amount * 100) / 100;
                    expectedPercent = Math.min(100, Math.round(ratio * 100));
                }
                assert.ok(root.spending_percent === expectedPercent,
                    `root spending_percent: expected ${expectedPercent}, got ${root.spending_percent}`);
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
