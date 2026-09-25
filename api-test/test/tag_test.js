const pactum = require('pactum');
const { createAccountForTransaction } = require('./transaction.handler');
const { createTracker } = require('./cleanup');

const tracker = createTracker();

after(async () => {
    await tracker.cleanup();
});

function makeTag (length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

it('Tag retrieval', async () => {
    await createAccountForTransaction();
    tracker.accountsFromStore('IncomeAccountID', 'AssetAccountID', 'ExpenseAccountID');

    const firstTag = makeTag(8);
    const secondTag = makeTag(16);

    tracker.transaction(await pactum.spec('Create Transaction', {
        '@DATA:TEMPLATE@': 'Transaction:Rent:V1',
        '@OVERRIDES@': {
            tags: [firstTag, secondTag]
        }
    }).returns('id'));

    await pactum.spec('read')
        .get('/tags')
        .expectJsonLike('tags[*]', [firstTag, secondTag]);
});
