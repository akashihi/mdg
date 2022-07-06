import {createSelector} from 'reselect';

import {getLastTransactions} from './StateGetters';
import {sprintf} from 'sprintf-js';
import {
    EnrichedOperation,
    EnrichedTransaction,
    Operation,
    Transaction,
    TransactionSummary
} from "../models/Transaction";

export const selectTransactions = createSelector(
    [getLastTransactions], enrichTransaction
)

export const selectLastTransactions = createSelector(
    [getLastTransactions], enrichTransaction
)

// Data preparation functions
function enrichTransaction(transactions: Transaction[]): EnrichedTransaction[] {
    return transactions.map((item: Transaction): EnrichedTransaction => {
        const dt = timestampToFormattedDate(item.timestamp);
        const summary = calculateTransactionTotals(item);
        const accountNames = renderTransactionAccountList(item);
        const ops = item.operations.map(o => enrichOperation(o));
        return {
            ...item, ...{
                dt: dt,
                accountNames: accountNames,
                summary: summary,
                operations: ops
            }
        }
    })
}

function timestampToFormattedDate(ts: string): string {
    const dt = new Date(ts);
    return sprintf('%d-%02d-%02d', dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
}

const enrichOperation = (op: Operation): EnrichedOperation => {
    let color = 'black'
    switch (op.account.account_type) {
        case 'INCOME':
            color = 'lime'
            break
        case 'ASSET':
            color = 'orange'
            break
        case 'EXPENSE':
            color = 'red'
            break
    }
    return {...op, color: color};
}

const renderTransactionAccountList = (transaction: Transaction): string => {
    // Tx account list should include only non-asset
    // account.
    // If transaction is built only of asset accounts,
    // they should be used
    if (transaction.operations.some(o => o.account.account_type !== 'ASSET')) {
        //Ok, we have non-asset accounts
        return transaction.operations.filter(o => o.account.account_type !== 'ASSET').map(o => o.account.name).join(', ');
    }
    return transaction.operations.map(o => o.account.name).join(', ');
}

const calculateTransactionTotals = (tx: Transaction): TransactionSummary => {
    // We need to calculate totals for all
    // types of accounts.
    //
    // If sum of 'asset' is positive in the tx and
    // at least one of other sums is not negative, it
    // is a 'earn' transaction.
    //
    // if sum of 'asset' is negative it's a 'spending'
    // transaction.
    //
    // if sum of 'asset' is zero and sum of 'expense' is
    // positive, it is still spending.
    //
    // In other cases it's a 'transfer' transaction.
    const opsByType = tx.operations.reduce((groups, item) => ({
        ...groups,
        [item.account.account_type]: [...(groups[item.account.account_type] || []), item.amount * item.rate]
    }), {})

    const summary = Object.fromEntries(Object.entries(opsByType).map((group: any[]) => {
        const totals = group[1].reduce((partialSum, a) => partialSum + a, 0)
        return [group[0], totals];
    }));
    if (summary.ASSET > 0 && (summary.INCOME !== 0 || summary.EXPENSE !== 0)) {
        return {color: 'lime', total: summary.ASSET}
    }

    if (summary.ASSET < 0) {
        return {color: 'red', total: summary.ASSET}
    }

    if (summary.ASSET === 0 && summary.EXPENSE > 0) {
        return {color: 'red', total: summary.EXPENSE}
    }

    return {color: 'orange', total: summary.ASSET}
}
