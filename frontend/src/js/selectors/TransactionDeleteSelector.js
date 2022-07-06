import { Map } from 'immutable'
import { createSelector } from 'reselect'

import { getLastTransactions, getTransactionToDeleteId } from './StateGetters'

export const selectTransactionToDeleteById = createSelector(
  [getLastTransactions, getTransactionToDeleteId], (transactions, id) => transactions.get(id, Map())
)

export const selectTransactionToDeleteName = createSelector(
  [selectTransactionToDeleteById], (tx) => {
    const name = tx.get('comment', '')
    if (!name) {
      return name
    }
    return '\'' + name + '\''
  }
)
