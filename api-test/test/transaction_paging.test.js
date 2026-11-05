const pactum = require('pactum');
const { createTracker } = require('./cleanup');
const { createAccountForTransaction } = require('./transaction.handler');

const NOT_EARLIER = '1999-03-01T00:00:00';
const NOT_LATER = '1999-03-31T23:59:59';
const FILTER = encodeURIComponent(JSON.stringify({ notEarlier: NOT_EARLIER, notLater: NOT_LATER }));
const LIMIT = 3;

const TIMESTAMPS = [
    '1999-03-20T10:00:00',
    '1999-03-10T12:00:00',
    '1999-03-10T12:00:00',
    '1999-03-10T12:00:00',
    '1999-03-05T08:00:00',
    '1999-03-05T08:00:00',
    '1999-03-15T09:30:00',
    '1999-03-02T07:00:00',
    '1999-03-18T21:15:00',
    '1999-03-07T13:45:00',
    '1999-03-12T00:00:00',
    '1999-03-25T23:00:00'
];

describe('Transaction paging', () => {
    const tracker = createTracker();
    const created = []; // { id, timestamp } in creation order, so ids ascend

    after(async () => {
        await tracker.cleanup();
    });

    function expectedOrder (ascending) {
        return created.slice().sort((a, b) => {
            const byTs = Date.parse(a.timestamp) - Date.parse(b.timestamp);
            if (byTs !== 0) {
                return ascending ? byTs : -byTs;
            }
            return b.id - a.id; // id is always descending
        }).map(tx => tx.id);
    }

    function pageUrl (sort) {
        return `/transactions?q=${FILTER}&limit=${LIMIT}${sort ? `&sort=${sort}` : ''}`;
    }

    async function getPage (url) {
        return pactum.spec('read').get(url).returns('res.body');
    }

    // Follows `next` until it is empty and checks each page on the way.
    async function walk (sort) {
        const ids = [];
        const total = created.length;
        let page = await getPage(pageUrl(sort));
        const firstPage = page;
        for (let guard = 0; guard < total + 2; guard++) {
            page.transactions.forEach(tx => ids.push(tx.id));
            if (page.left !== total - ids.length) {
                throw new Error(`left is ${page.left} after ${ids.length} rows, expected ${total - ids.length}`);
            }
            if (page.next === '') {
                break;
            }
            page = await getPage(`/transactions?cursor=${encodeURIComponent(page.next)}`);
        }
        return { ids, firstPage };
    }

    it('Create transactions with timestamps out of creation order', async () => {
        await createAccountForTransaction();
        tracker.accountsFromStore('IncomeAccountID', 'AssetAccountID', 'ExpenseAccountID');

        for (const timestamp of TIMESTAMPS) {
            const id = await pactum.spec('Create Transaction', {
                    '@DATA:TEMPLATE@': 'Transaction:Rent:V1',
                    '@OVERRIDES@': { timestamp }
                })
                .returns('id');
            tracker.transaction(id);
            created.push({ id, timestamp });
        }
    });

    it('Walk all pages in the default order without losing or repeating rows', async () => {
        const { ids } = await walk();
        if (new Set(ids).size !== ids.length) {
            throw new Error(`duplicated rows: ${ids}`);
        }
        if (JSON.stringify(ids) !== JSON.stringify(expectedOrder(false))) {
            throw new Error(`got ${ids}, expected ${expectedOrder(false)}`);
        }
    });

    it('Walk all pages with sort=-timestamp without losing or repeating rows', async () => {
        const { ids } = await walk('-timestamp');
        if (new Set(ids).size !== ids.length) {
            throw new Error(`duplicated rows: ${ids}`);
        }
        if (JSON.stringify(ids) !== JSON.stringify(expectedOrder(true))) {
            throw new Error(`got ${ids}, expected ${expectedOrder(true)}`);
        }
    });

    it('Report the total on the first page and an empty next on the last', async () => {
        const first = await getPage(pageUrl());
        if (first.transactions.length !== LIMIT || first.left !== created.length - LIMIT) {
            throw new Error(`unexpected first page: ${first.transactions.length} rows, left ${first.left}`);
        }
        const all = await getPage(`/transactions?q=${FILTER}&limit=${created.length}`);
        if (all.transactions.length !== created.length || all.left !== 0 || all.next !== '') {
            throw new Error('a page holding everything must have left 0 and an empty next');
        }
    });

    it('Return the first page again when following first from a later page', async () => {
        const first = await getPage(pageUrl());
        const second = await getPage(`/transactions?cursor=${encodeURIComponent(first.next)}`);
        const third = await getPage(`/transactions?cursor=${encodeURIComponent(second.next)}`);
        const back = await getPage(`/transactions?cursor=${encodeURIComponent(third.first)}`);
        const expected = first.transactions.map(tx => tx.id);
        if (expected.length === 0) {
            throw new Error('the first page is empty');
        }
        if (JSON.stringify(back.transactions.map(tx => tx.id)) !== JSON.stringify(expected)) {
            throw new Error('first does not lead back to the first page');
        }
        if (back.left !== first.left) {
            throw new Error(`left is ${back.left} after first, expected ${first.left}`);
        }
    });

    it('Reject a cursor this API never issued', async () => {
        await pactum.spec('expect error', { statusCode: 422, code: 'CURSOR_DATA_INVALID', instance: '/transactions' })
            .get('/transactions?cursor=%C2%AC%C3%9E');
    });

    // URL-safe, padded base64 of a JSON document, as the server issues them.
    function handCursor (body) {
        const b64 = Buffer.from(JSON.stringify(body)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
        return encodeURIComponent(b64);
    }

    it('Reject an old style cursor carrying only a pointer id', async () => {
        await pactum.spec('expect error', { statusCode: 422, code: 'CURSOR_DATA_INVALID', instance: '/transactions' })
            .get(`/transactions?cursor=${handCursor({ limit: LIMIT, pointer: created[0].id })}`);
    });

    it('Reject a cursor carrying pointerTs without a pointer', async () => {
        await pactum.spec('expect error', { statusCode: 422, code: 'CURSOR_DATA_INVALID', instance: '/transactions' })
            .get(`/transactions?cursor=${handCursor({ limit: LIMIT, pointerTs: created[0].timestamp })}`);
    });

    it('Accept a hand-built cursor with neither pointer field as the first page', async () => {
        const filter = { notEarlier: NOT_EARLIER, notLater: NOT_LATER };
        const page = await getPage(`/transactions?cursor=${handCursor({ filter, limit: LIMIT })}`);
        const expected = (await getPage(pageUrl())).transactions.map(tx => tx.id);
        if (JSON.stringify(page.transactions.map(tx => tx.id)) !== JSON.stringify(expected)) {
            throw new Error('a cursor without pointers must return the first page');
        }
    });
});
