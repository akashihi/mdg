const { request, stash } = require('pactum');
const { BASE_URL, purge, applyPreconditions, snapshotSettings, restoreSettings } = require('./cleanup');

// load handlers
require('./error.handler');
require('./op.handler');
require('./currency.handler');
require('./settings.handler');
require('./category.handler');
require('./account.handler');
require('./transaction.handler');
require('./budget.handler');
require('./budget.entry.handler');

const PURGE_TIMEOUT = 300000;

let settingsSnapshot = null;

// global hook
//
// Purging before the run as well as after it is what makes the suite recoverable.
// A run that fails part-way leaves its data behind, because pactum skips the
// clean steps of a failed step by design, and a single leftover budget is enough
// to fail every later run at POST /budgets with BUDGET_OVERLAPPING. Cleaning up
// front means a run always starts from the same state, whatever happened to the
// previous one.
before(async function () {
    this.timeout(PURGE_TIMEOUT);
    stash.loadData();
    request.setBaseUrl(BASE_URL);
    settingsSnapshot = await snapshotSettings();
    await purge();
    await applyPreconditions();
});

after(async function () {
    this.timeout(PURGE_TIMEOUT);
    await purge();
    await restoreSettings(settingsSnapshot);
});
