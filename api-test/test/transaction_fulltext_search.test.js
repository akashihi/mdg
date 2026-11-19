const pactum = require('pactum');
const itParam = require('mocha-param');
const { createAccountForTransaction } = require('./transaction.handler');
const { createTracker } = require('./cleanup');

describe('Transaction full text search semantics', () => {
    const tracker = createTracker();

    before(async () => {
        await createAccountForTransaction();
        tracker.accountsFromStore('IncomeAccountID', 'AssetAccountID', 'ExpenseAccountID');
    });

    after(async () => {
        await tracker.cleanup();
    });

    async function create (comment, tags = []) {
        return tracker.transaction(await pactum.spec('Create Transaction', {
            '@DATA:TEMPLATE@': 'Transaction:Search:V1',
            '@OVERRIDES@': { comment, tags }
        }).returns('id'));
    }

    // Ids of the transactions of the test account that match the filter.
    async function search (filter) {
        const assetId = pactum.stash.getDataStore().AssetAccountID;
        const q = encodeURIComponent(JSON.stringify(Object.assign({}, filter, { account_id: `[${assetId}]` })));
        return await pactum.spec('read')
            .get('/transactions')
            .withQueryParams('q', q)
            .returns(ctx => ctx.res.json.transactions.map(transaction => transaction.id));
    }

    const FOUND = [
        // inflection, ru, both directions
        ['ru inflected query finds the base form', 'Купил молоко', 'молока'],
        ['ru base form finds an inflected comment', 'Выпил парного молока', 'молоко'],
        // inflection, cs, both directions
        ['cs base form finds an inflected comment', 'Nakoupil v obchodech', 'obchod'],
        ['cs inflected query finds the base form', 'Velký obchod', 'obchodech'],
        // compound parts
        ['fi compound part finds the compound', 'Ruokakauppa Prisma', 'kauppa'],
        ['de compound part finds the compound', 'Lebensmittelgeschäft Meier', 'Geschäft'],
        // diacritics, case
        ['query without diacritics finds a diacritic comment', 'Čerstvé mléko', 'mleko'],
        ['query ignores case', 'Fresh Pretzels', 'PRETZELS'],
        // typos
        ['ru typo finds the word', 'Купил молоко в магазине', 'молако'],
        ['typo finds an unknown shop name', 'Ruokakauppa Prisma', 'prsima'],
        ['transposition is one edit', 'Cash Income', 'incmoe'],
        ['one edit is tolerated on a 4-letter word', 'Soup bowl', 'soap'],
        // 8 letters: two deletions, k = 2
        ['two edits are tolerated on an 8-letter word', 'Gorgonzola', 'gorgnzla'],
        // 8+ letters: two separate transpositions (go->og, la->al), 2 for optimal string alignment, 4 for plain Levenshtein
        ['two transpositions are tolerated on a 10-letter word', 'Gorgonzola', 'ogrgonzoal'],
        // numbers
        ['comma in a number finds a dot', 'Cash 22.50 EUR', '22,50'],
        ['dot in a number finds a comma', 'Cash 33,75 EUR', '33.75'],
        ['number matches itself', 'Invoice 2024', '2024'],
        // multi-word
        ['every word of a query may match', 'Zelený čaj Tesco', 'zeleny caj'],
        ['stop words are dropped from the query', 'Box of apples', 'the box'],
        ['a stop-word-only query still searches', 'Out of the box', 'the']
    ];

    itParam('Found: ${value[0]}', FOUND, async ([, comment, query]) => { // eslint-disable-line no-template-curly-in-string
        const id = await create(comment);
        const ids = await search({ comment: query });
        if (!ids.includes(id)) {
            throw new Error(`"${query}" must find "${comment}"`);
        }
    });

    const NOT_FOUND = [
        ['two edits are not tolerated on a 5-letter word', 'Test transaction', 'tesla'],
        ['one edit is not tolerated on a 3-letter word', 'Fig jam', 'fug'],
        // 7 letters: two substitutions, k = 1
        ['two edits are not tolerated on a 7-letter word', 'Lasagne', 'lasagxx'],
        ['a prefix is not a stem', 'Income', 'come'],
        ['a number never typo-matches', 'Invoice 2024', '2025'],
        ['one absent word makes the result empty', 'Zelený čaj Tesco', 'zeleny kavarna'],
        ['a word that matches nothing makes the result empty', 'Plain note', 'qzxwvutsr', true]
    ];

    itParam('Not found: ${value[0]}', NOT_FOUND, async ([, comment, query, empty]) => { // eslint-disable-line no-template-curly-in-string
        const id = await create(comment);
        const ids = await search({ comment: query });
        if (ids.includes(id)) {
            throw new Error(`"${query}" must not find "${comment}"`);
        }
        if (empty && ids.length !== 0) {
            throw new Error(`"${query}" matches nothing, the result must be empty`);
        }
    });

    it('A stop-word-only query does not find a comment without that word', async () => {
        const id = await create('Plain note about bread');
        const ids = await search({ comment: 'the' });
        if (ids.includes(id)) {
            throw new Error('"the" must not find a comment without it');
        }
    });

    it('A mixed-language comment is found by a word from each language', async () => {
        const id = await create('Купил молоко и ruokakauppa Prisma');
        for (const query of ['молока', 'kauppa']) {
            const ids = await search({ comment: query });
            if (!ids.includes(id)) {
                throw new Error(`"${query}" must find the mixed-language comment`);
            }
        }
    });

    it('Every word is required, so one matching and one absent word find nothing', async () => {
        const id = await create('Gorgonzola pizza');
        if (!(await search({ comment: 'gorgonzola pizza' })).includes(id)) {
            throw new Error('Both words present must find the comment');
        }
        if ((await search({ comment: 'gorgonzola qzxwvutsr' })).includes(id)) {
            throw new Error('An absent second word must exclude the comment');
        }
    });

    it('A typo is matched against whole words only, not against a compound part alone', async () => {
        // "lumilauta" is a compound of "lumi" and "lauta"; "lauda" is one edit from
        // the part "lauta" and from no whole stored word. Precondition: "lauta" must never
        // have been stored as a whole word in the database, because that flag is permanent.
        const id = await create('Lumilauta');
        if (!(await search({ comment: 'lauta' })).includes(id)) {
            throw new Error('The correctly typed compound part must find the compound');
        }
        if ((await search({ comment: 'lauda' })).includes(id)) {
            throw new Error('A typo of a compound part must not find the compound');
        }
    });

    describe('with tags', () => {
        let both, onlyFoo, onlyBar;

        before(async () => {
            both = await create('Gorgonzola calzone', ['zqtagalpha', 'zqtaggamma']);
            onlyFoo = await create('Unrelated lasagne', ['zqtagfoo']);
            onlyBar = await create('Another unrelated ravioli', ['zqtagbar']);
        });

        it('Comment and tag combine with AND: a matching tag keeps the transaction', async () => {
            const ids = await search({ comment: 'gorgonzola', tag: 'zqtagalpha' });
            if (!ids.includes(both)) {
                throw new Error('Comment and tag both match, the transaction must be found');
            }
        });

        it('Comment and tag combine with AND: a comment that matches with a tag that does not excludes it', async () => {
            const ids = await search({ comment: 'gorgonzola', tag: 'zqtagfoo' });
            if (ids.includes(both)) {
                throw new Error('The tag does not match, the transaction must be excluded');
            }
        });

        it('Comment and tag combine with AND: a tag that matches with a comment that does not excludes it', async () => {
            const ids = await search({ comment: 'gorgonzola', tag: '[zqtagfoo]' });
            if (ids.includes(onlyFoo)) {
                throw new Error('The comment does not match, the transaction must be excluded');
            }
        });

        it('Several tags match when a transaction has any of them', async () => {
            const ids = await search({ tag: '[zqtagfoo,zqtagbar]' });
            if (!ids.includes(onlyFoo) || !ids.includes(onlyBar)) {
                throw new Error('Both transactions carry one of the listed tags');
            }
            if (ids.includes(both)) {
                throw new Error('A transaction with none of the listed tags must be excluded');
            }
        });

        it('A listed tag that matches nothing does not exclude the others', async () => {
            const ids = await search({ tag: '[ zqtagfoo , zqnosuchtag ]' });
            if (!ids.includes(onlyFoo) || ids.includes(onlyBar)) {
                throw new Error('Only the transaction with the existing tag must be found');
            }
        });

        it('A tag that matches nothing gives an empty result', async () => {
            const ids = await search({ tag: 'zqnosuchtagatall' });
            if (ids.length !== 0) {
                throw new Error('No transaction has this tag');
            }
        });

        it('A tag name ignores case and tolerates a typo', async () => {
            const ids = await search({ tag: 'ZQTAGFOO' });
            if (!ids.includes(onlyFoo)) {
                throw new Error('Tag names ignore case');
            }
            const typo = await search({ tag: 'zqtagfo' });
            if (!typo.includes(onlyFoo)) {
                throw new Error('Tag names tolerate one edit');
            }
        });

        it('An empty comment adds no constraint', async () => {
            const ids = await search({ comment: '' });
            for (const id of [both, onlyFoo, onlyBar]) {
                if (!ids.includes(id)) {
                    throw new Error('An empty comment must not filter');
                }
            }
        });

        it('A comment of punctuation only adds no constraint', async () => {
            const ids = await search({ comment: ' ,. ' });
            if (!ids.includes(onlyBar)) {
                throw new Error('A comment without words must not filter');
            }
        });

        it('An empty tag list adds no constraint', async () => {
            for (const tag of ['', '[]']) {
                const ids = await search({ tag });
                for (const id of [both, onlyFoo, onlyBar]) {
                    if (!ids.includes(id)) {
                        throw new Error(`tag "${tag}" must not filter`);
                    }
                }
            }
        });

        it('An empty tag list leaves the comment constraint in force', async () => {
            const ids = await search({ comment: 'gorgonzola', tag: '[]' });
            if (!ids.includes(both) || ids.includes(onlyFoo) || ids.includes(onlyBar)) {
                throw new Error('Only the comment must constrain the result');
            }
        });

        it('An empty comment leaves the tag constraint in force', async () => {
            const ids = await search({ comment: '', tag: 'zqtagbar' });
            if (!ids.includes(onlyBar) || ids.includes(onlyFoo)) {
                throw new Error('Only the tag must constrain the result');
            }
        });
    });

    it('A transaction is searchable right after create', async () => {
        const id = await create('Zakuska borscht');
        const ids = await search({ comment: 'borscht' });
        if (!ids.includes(id)) {
            throw new Error('A new transaction must be found at once');
        }
    });

    it('After update the old words stop matching and the new ones match', async () => {
        const id = await create('Zakuska varenyky');
        await pactum.spec('update')
            .put('/transactions/{id}')
            .withPathParams('id', id)
            .withJson({
                '@DATA:TEMPLATE@': 'Transaction:Search:V1',
                '@OVERRIDES@': { comment: 'Zakuska pelmeni' }
            });

        if ((await search({ comment: 'varenyky' })).includes(id)) {
            throw new Error('The old word must stop matching');
        }
        if (!(await search({ comment: 'pelmeni' })).includes(id)) {
            throw new Error('The new word must match');
        }
    });

    it('Transactions created earlier are still found after a reindex', async () => {
        const id = await create('Reindexable ostrich');
        await pactum.spec('update')
            .put('/settings/{id}')
            .withPathParams('id', 'mnt.transaction.reindex')
            .withJson({})
            .withRequestTimeout(10000);

        if (!(await search({ comment: 'ostrich' })).includes(id)) {
            throw new Error('A reindex must keep the transaction searchable');
        }
        if (!(await search({ comment: 'ostirch' })).includes(id)) {
            throw new Error('A reindex must keep the typo match working');
        }
    }).timeout(15000);
});
