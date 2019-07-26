import {Map} from 'immutable';
import { createSelector } from 'reselect'

import {getTransactions, getAccounts} from '../selectors/StateGetters'
import {timestampToFormattedDate} from '../util/DateUtil'

export const selectTransactions = createSelector(
    [getTransactions, getAccounts], (transactions, accounts) => {
        return transactions.map(item => item.update('timestamp', timestampToFormattedDate))
            .map(item => item.set('accountNames', renderTransactionAccountList(item.get('operations'), accounts)))
            .map(item => item.set('totals', calculateTransactionTotals(item, accounts)))
            .map((item, id) => item.set('id', id))
            .map(item => item.update('operations', ops => ops.map(op => accountToOp(op, accounts))));
    }
);

//Data preparation functions
const accountToOp = (op, accounts) => {
    const opAccount = accounts.get(op.account_id);

    op.name = opAccount.get('name');

    op.color = 'black';
    switch(opAccount.get('account_type')) {
        case 'income':
            op.color = 'lime';
            break;
        case 'asset':
            op.color = 'orange';
            break;
        case 'expense':
            op.color = 'red';
            break;

    }
    return op;
}
const renderTransactionAccountList = (operations, accounts) => {
    //Tx account list should include only non-asset
    //account.
    //If transaction is built only of asset accounts,
    //they should be used
    const opAccounts = operations.map((item) => item.account_id);
    const usedAccounts = accounts.filter((item, key) => opAccounts.includes(key));

    const nonAssetAccounts = usedAccounts.filter((item) => item.get('account_type') !== 'asset');
    if (!nonAssetAccounts.isEmpty()) {
        return nonAssetAccounts.map((item) => item.get('name')).valueSeq().join(', ')
    } else {
        return usedAccounts.map((item) => item.get('name')).valueSeq().join(', ')
    }
};

const calculateTransactionTotals = (tx, accounts) => {
    //We need to calculate totals for all
    //types of accounts.
    //
    //If sum of 'asset' is positive in the tx and
    //at least on of other sums is not negative, it
    //is a 'earn' transaction.
    //
    //if sum of 'asset' is negative it's a 'spending'
    //transaction.
    //
    //if sum of 'asset' is zero and sum of 'expense' is
    //positive, it is still spending.
    //
    //In other cases it's a 'transfer' transaction.
    const sumByAccount = ops => ops.reduce((acc, item) => {
        let amount = item.amount;
        if (item.rate) {
            amount = amount * item.rate
        }
        acc[item.type] += amount;
        return acc
    }, {asset: 0, income: 0, expense: 0});


    const expandedOperations = tx.get('operations').map((op) => {
        const opAccount = accounts.get(op.account_id);
        return {amount: op.amount, rate: op.rate, type: opAccount.get('account_type')}
    });


    const summary = sumByAccount(expandedOperations);
    if (summary['asset'] > 0 && (summary['income'] !== 0 || summary['expense'] !== 0)) {
        return Map({color: 'lime', total: summary['asset'].toFixed(2)});
    }

    if (summary['asset'] < 0) {
        return Map({color: 'red', total: summary['asset'].toFixed(2)});
    }

    if (summary['asset'] === 0 && summary['expense'] > 0) {
        return Map({color: 'red', total: summary['expense'].toFixed(2)});
    }

    const positives = sumByAccount(expandedOperations.filter((item) => item.amount > 0));
    if (positives['asset'] !== 0) {
        return Map({color: 'orange', total: positives['asset'].toFixed(2)});
    }

    if (positives['income'] !== 0) {
        return Map({color: 'orange', total: positives['income'].toFixed(2)});
    }

    if (positives['income'] !== 0) {
        return Map({color: 'orange', total: positives['income'].toFixed(2)});
    }

    return Map({color: 'black', total: 0})
};
