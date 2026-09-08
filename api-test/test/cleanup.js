// Unconditional teardown for the api-test suite.
//
// Pactum's own cleanup is deliberately conditional: E2E.cleanup() runs a step's
// clean specs only when every spec of that step is 'PASSED', and once a spec has
// failed every later step is marked 'SKIPPED' without being sent. That preserves
// state for debugging, but it also means a failed run leaves its data behind —
// and a leftover budget makes the next run fail at POST /budgets with 412
// BUDGET_OVERLAPPING, which skips cleanup again. The suite can never recover on
// its own.
//
// These helpers run from mocha root hooks instead, so they execute regardless of
// how the tests went. Plain fetch rather than pactum.spec(): hundreds of specs
// would swamp the reporter, and an expectStatus failure inside a hook would take
// the whole run down.

const { stash } = require('pactum');

const BASE_URL = 'http://localhost:8080';
const MEDIA_TYPE = 'application/vnd.mdg+json;version=1';

const HEADERS = { 'Content-Type': MEDIA_TYPE };

function log (message) {
    console.log(`[cleanup] ${message}`); // eslint-disable-line no-console
}

async function list (resource) {
    const response = await fetch(`${BASE_URL}/${resource}`, { headers: HEADERS });
    if (!response.ok) {
        log(`could not list /${resource}: ${response.status}`);
        return [];
    }
    const body = await response.json();
    return body[resource] || [];
}

async function remove (resource, id) {
    const response = await fetch(`${BASE_URL}/${resource}/${id}`, { method: 'DELETE', headers: HEADERS });
    if (response.status === 404) {
        return false; // already gone, which is all a teardown wants
    }
    if (response.status !== 204) {
        log(`could not delete /${resource}/${id}: ${response.status}`);
        return false;
    }
    return true;
}

async function removeAll (resource, predicate) {
    const items = (await list(resource)).filter(predicate || (() => true));
    let removed = 0;
    for (const item of items) {
        if (await remove(resource, item.id)) {
            removed++;
        }
    }
    return removed;
}

function isNotAssetCategory (category) {
    return String(category.account_type).toLowerCase() !== 'asset';
}

// The order below is mandatory:
//   - an account with operations cannot be deleted (409 ACCOUNT_IN_USE), so
//     transactions go first;
//   - BUDGETENTRY.ACCOUNT_ID references ACCOUNT(ID) with no ON DELETE clause and
//     a trigger creates an entry for every non-asset account, so deleting an
//     account while any budget exists fails on the foreign key. BUDGET_ID is
//     ON DELETE CASCADE, so dropping the budget takes its entries with it —
//     budgets therefore have to go before accounts.
async function purge () {
    if (process.env.MDG_SKIP_PURGE) {
        log('MDG_SKIP_PURGE is set, skipping');
        return {};
    }
    const removed = {
        transactions: await removeAll('transactions'),
        budgets: await removeAll('budgets'),
        accounts: await removeAll('accounts'),
        categories: await removeAll('categories', isNotAssetCategory)
    };
    const summary = Object.entries(removed)
        .filter(([, count]) => count > 0)
        .map(([resource, count]) => `${count} ${resource}`)
        .join(', ');
    log(summary ? `removed ${summary}` : 'nothing to remove');
    return removed;
}

// The suite's expected amounts assume a primary currency of EUR.
const TEST_PRIMARY_CURRENCY = '978';

async function applyPreconditions () {
    if (process.env.MDG_SKIP_PURGE) {
        return; // asked not to touch the data, and this would not be restored either
    }
    const response = await fetch(`${BASE_URL}/settings/currency.primary`, {
        method: 'PUT',
        headers: HEADERS,
        body: JSON.stringify({ id: 'currency.primary', value: TEST_PRIMARY_CURRENCY })
    });
    if (response.status !== 202) {
        log(`could not set the primary currency: ${response.status}`);
    }
}

async function snapshotSettings () {
    const settings = await list('settings');
    return Object.fromEntries(settings.map(setting => [setting.id, setting.value]));
}

async function restoreSettings (snapshot) {
    if (!snapshot || process.env.MDG_SKIP_PURGE) {
        return 0;
    }
    const current = await snapshotSettings();
    let restored = 0;
    for (const [id, value] of Object.entries(snapshot)) {
        if (current[id] === value) {
            continue;
        }
        const response = await fetch(`${BASE_URL}/settings/${id}`, {
            method: 'PUT',
            headers: HEADERS,
            body: JSON.stringify({ id, value })
        });
        if (response.status === 202) {
            log(`restored ${id} to ${value}`);
            restored++;
        } else {
            log(`could not restore ${id}: ${response.status}`);
        }
    }
    return restored;
}

// Teardown for suites that do not drive pactum's e2e machinery.
function createTracker () {
    const accounts = [];
    const transactions = [];
    const categories = [];
    return {
        account (id) {
            accounts.push(id);
            return id;
        },
        category (id) {
            categories.push(id);
            return id;
        },
        transaction (id) {
            transactions.push(id);
            return id;
        },
        // createAccountForTransaction() leaves its ids in the pactum data store
        // under well-known keys; this picks them straight back out.
        accountsFromStore (...keys) {
            const dataStore = stash.getDataStore();
            keys.forEach(key => accounts.push(dataStore[key]));
        },
        // Transactions first: an account that still carries operations answers
        // 409 ACCOUNT_IN_USE. Categories last, because deleting one unassigns the
        // accounts that point at it.
        async cleanup () {
            for (const id of transactions) {
                await remove('transactions', id);
            }
            for (const id of accounts) {
                await remove('accounts', id);
            }
            for (const id of categories) {
                await remove('categories', id);
            }
        }
    };
}

module.exports = { BASE_URL, purge, applyPreconditions, snapshotSettings, restoreSettings, createTracker };
