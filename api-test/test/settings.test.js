const pactum = require('pactum');
const itParam = require('mocha-param');
const { snapshotSettings, restoreSettings } = require('./cleanup');

const SETTINGS = ['currency.primary', 'ui.transaction.closedialog', 'ui.language', 'ui.overviewpanel.widgets'];

describe('Settings', () => {
    // These tests drive settings to fixed values and never put them back. The
    // settings are application-wide singletons, so the values outlive the run
    // unless the suite restores them itself. Wrapped in a describe so the hooks
    // stay scoped to this file rather than becoming root hooks.
    let snapshot = null;

    before(async () => {
        snapshot = await snapshotSettings();
    });

    after(async () => {
        await restoreSettings(snapshot);
    });

    it('All settings are present in the settings list', async () => {
        await pactum.spec('read')
            .get('/settings')
            .expectJsonLike('settings[*].id', SETTINGS);
    });

    itParam('Loading setting ${value}', SETTINGS, async (params) => { // eslint-disable-line no-template-curly-in-string
        await pactum.spec('read')
            .get('/settings/{id}')
            .withPathParams('id', params)
            .expectJson("id", params);
    });

    const SETTINGS_TRIGGERS = [
        {
            id: 'ui.transaction.closedialog',
            firstValue: 'false',
            secondValue: 'true'
        },
        {
            id: 'currency.primary',
            firstValue: '840',
            secondValue: '978'
        }

    ];

    itParam('Check ${value.id} value setting', SETTINGS_TRIGGERS, async (params) => { // eslint-disable-line no-template-curly-in-string
        await pactum.spec('Set setting value', {
            id: params.id,
            value: params.firstValue
        });

        await pactum.spec('Check setting value', { id: params.id, value: params.firstValue });

        await pactum.spec('Set setting value', {
            id: params.id,
            value: params.secondValue
        });

        await pactum.spec('Check setting value', { id: params.id, value: params.secondValue });
    });

    it('Invalid primary currency is rejected', async () => {
        await pactum.spec('expect error', { statusCode: 422, code: 'SETTING_DATA_INVALID' })
            .put('/settings/{id}')
            .withPathParams('id', 'currency.primary')
            .withJson({
                id: 'currency.primary',
                value: -1
            });
    });

    // ui.language is not validated, so a locale without analyzer settings of its own used to
    // make the next reindex a 500. The after hook puts the language back.
    it('Reindex falls back to the default analyzer settings for an unknown language', async () => {
        await pactum.spec('Set setting value', { id: 'ui.language', value: 'xx' });

        await pactum.spec('update')
            .put('/settings/{id}')
            .withPathParams('id', 'mnt.transaction.reindex')
            .withJson({})
            .withRequestTimeout(10000);
    }).timeout(15000);

    itParam('Setting update without a value is rejected: ${value}', SETTINGS, async (params) => { // eslint-disable-line no-template-curly-in-string
        await pactum.spec('expect error', { statusCode: 400, code: 'REQUEST_BODY_INVALID' })
            .put('/settings/{id}')
            .withPathParams('id', params)
            .withJson({});
    });
});
