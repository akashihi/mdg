const pactum = require('pactum');

const BUDGETS_SERIES = [
    {
        id: -1,
        term_beginning: '2022-01-01',
        term_end: '2022-01-31',
    },
    {
        id: -1,
        term_beginning: '2021-01-01',
        term_end: '2021-01-31',
    },
    {
        id: -1,
        term_beginning: '2020-01-01',
        term_end: '2020-01-31',
    },
    {
        id: -1,
        term_beginning: '2019-01-01',
        term_end: '2019-01-31',
    },
    {
        id: -1,
        term_beginning: '2018-01-01',
        term_end: '2018-01-31',
    },
    {
        id: -1,
        term_beginning: '2017-01-01',
        term_end: '2017-01-31',
    },
];

const IDS = ['20220101','20210101','20200101','20190101','20180101','20170101'];

describe('Budget paging', () => {
    const e2e = pactum.e2e('Budget paging');

    after(async () => {
        await e2e.cleanup();
    });

    it('Create series of budgets', async () => {
        for (let b of BUDGETS_SERIES) {
            await e2e.step('Post budget')
                .spec('Create Budget', b);
        }
    });

    it('Load first portion of budgets', async () => {
        await e2e.step('List budgets')
            .spec('read')
            .get('/budgets?limit=3')
            .expectJsonMatch('budgets[0].id', 20220101)
            .expectJsonMatch('budgets[1].id', 20210101)
            .expectJsonMatch('budgets[2].id', 20200101)
            .expectJsonMatch('left', 3);
    });

    it('Load second  portion of budgets', async () => {
        await e2e.step('List budgets')
            .spec('read')
            .get('/budgets?limit=3')
            .stores("NextBudgetCursor", "next");

        await e2e.step('Load next budget cursor')
            .spec('read')
            .get('/budgets?cursor={cursor}')
            .withPathParams('cursor', '$S{NextBudgetCursor}')
            .expectJsonMatch('budgets[0].id', 20190101)
            .expectJsonMatch('budgets[1].id', 20180101)
            .expectJsonMatch('budgets[2].id', 20170101)
            .expectJsonMatch('left', 0);
    });

    it('Reject a cursor this API never issued', async () => {
        await e2e.step('List budgets')
            .spec('expect error', { statusCode: 422, code: 'CURSOR_DATA_INVALID', instance: '/budgets' })
            .get('/budgets?cursor=%C2%AC%C3%9E');
    });

    it('Read an exhausted cursor as no cursor at all', async () => {
        // The UI hands the empty `next` straight back, so it has to answer the first page
        await e2e.step('List budgets')
            .spec('read')
            .get('/budgets?cursor=')
            .expectJsonMatch('budgets[0].id', 20220101);
    });

    it('Delete budgets', async () => {
        for (let id in IDS) {
            await e2e.step('Delete budget')
                .spec('delete')
                .delete('/budgets/{id}')
                .withPathParams('id', IDS[id]);
        }
    });
});
