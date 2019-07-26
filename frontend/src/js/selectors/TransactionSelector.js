import { createSelector } from 'reselect'

import {getTransactions, getAccounts} from '../selectors/StateGetters'
import {timestampToFormattedDate} from '../util/DateUtil'

export const selectTransactions = createSelector(
    [getTransactions, getAccounts], (transactions, accounts) => {
        return transactions.map(item => item.update('timestamp', timestampToFormattedDate))
            .map(item => item.set('accountNames', renderTransactionAccountList(item.get('operations'), accounts)))
    }
);

//Data preparation functions
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
