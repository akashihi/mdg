const pactum = require('pactum');
const { expression } = require('pactum-matchers');
const { createAccountForTransaction } = require('./transaction.handler');

describe('Account deletion clearance', () => {
  const e2e = pactum.e2e('Account deletion clearance');

  it('Create Account and add Ops', async () => {
    await createAccountForTransaction(e2e);

    await e2e.step('Create transaction')
      .spec('Create Transaction', { '@DATA:TEMPLATE@': 'Transaction:Rent:V1' })
      .stores('TransactionID', 'id')
      .expectJsonLike({'@DATA:TEMPLATE@': 'Transaction:Rent:V1'});
  });

  it('Account with operations is not deletable', async () => {
    await e2e.step('Read account status')
      .spec('read')
      .get('/accounts/{id}/status')
      .withPathParams('id', '$S{AssetAccountID}')
      .expectJson('deletable', false);
  });

  it('Deletion of used account fails', async () => {
    await e2e.step('Delete used account')
      .spec()
      .withHeaders('Content-Type', 'application/vnd.mdg+json;version=1')
      .delete('/accounts/{id}')
      .withPathParams('id', '$S{AssetAccountID}')
      .expectStatus(409);
  });

  it('Delete transaction', async () => {
    await e2e.step('Delete transaction')
      .spec('delete')
      .delete('/transactions/{id}')
      .withPathParams('id', '$S{TransactionID}');
  });

  it('Account without operations is deletable', async () => {
    await e2e.step('Read account status')
      .spec('read')
      .get('/accounts/{id}/status')
      .withPathParams('id', '$S{AssetAccountID}')
      .expectJson('deletable', true);
  });

  it('Deletion of unused account succeeds', async () => {
    await e2e.step('Delete used account')
      .spec()
      .withHeaders('Content-Type', 'application/vnd.mdg+json;version=1')
      .delete('/accounts/{id}')
      .withPathParams('id', '$S{AssetAccountID}')
      .expectStatus(204);
  });

  it('Deleted account is not in non-filtered account lists', async () => {
    await e2e.step('Deleted account is not in non-filtered account lists')
      .spec('read')
      .get('/accounts')
      .expectJsonMatch('accounts[*].id', expression('$S{AccountID}', '!$V.includes($S{AssetAccountID})'));

    await e2e.cleanup();
  });
});
