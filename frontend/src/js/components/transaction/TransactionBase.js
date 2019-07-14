import React from 'react';

export default class TransactionBase extends React.Component {
    renderTransactionAccountList(operations, accounts) {
        //Tx account list should include only non-asset
        //account.
        //If transaction is built only of asset accounts,
        //they should be used
        var opAccounts = operations.map((item) => item.account_id);
        var usedAccounts = accounts.filter((item, key) => opAccounts.includes(key));

        var nonAssetAccounts = usedAccounts.filter((item) => item.get('account_type') !== 'asset');
        if (!nonAssetAccounts.isEmpty()) {
            return nonAssetAccounts.map((item) => item.get('name')).valueSeq().join(', ')
        } else {
            return usedAccounts.map((item) => item.get('name')).valueSeq().join(', ')
        }
    }

    getTotalChange() {
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

        const tx = this.props.transaction;
        const accounts = this.props.accounts;

        const summary = tx.get('operations').map((op) => {
            var opAccount = accounts.get(op.account_id);
            return {amount: op.amount, rate: op.rate, type: opAccount.get('account_type')}
        }).reduce((acc, item) => {
            let amount = item.amount;
            if (item.rate) {
                amount = amount * item.rate
            }
            acc[item.type] += amount;
            return acc
        }, {asset: 0, income: 0, expense: 0});

        if (summary['asset'] > 0 && (summary['income'] !== 0 || summary['expense'] !== 0)) {
            return {color: 'lime', total: summary['asset'].toFixed(2)};
        }

        if (summary['asset'] < 0) {
            return {color: 'red', total: summary['asset'].toFixed(2)};
        }

        if (summary['asset'] === 0 && summary['expense'] > 0) {
            return {color: 'red', total: summary['expense'].toFixed(2)};
        }

        const positives = tx.get('operations').map((op) => {
            var opAccount = accounts.get(op.account_id);
            return {amount: op.amount, rate: op.rate, type: opAccount.get('account_type')}
        }).filter((item) => item.amount > 0)
            .reduce((acc, item) => {
                let amount = item.amount;
                if (item.rate) {
                    amount = amount * item.rate
                }
                acc[item.type] += amount;
                return acc
            }, {asset: 0, income: 0, expense: 0});

        if (positives['asset'] !== 0) {
            return {color: 'orange', total: positives['asset'].toFixed(2)};
        }

        if (positives['income'] !== 0) {
            return {color: 'orange', total: positives['income'].toFixed(2)};
        }

        if (positives['income'] !== 0) {
            return {color: 'orange', total: positives['income'].toFixed(2)};
        }

        return {color: 'black', total: 0}
    }
}
