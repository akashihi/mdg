import {Action} from 'redux';
import jQuery from 'jquery';
import moment from 'moment';
import {Map} from 'immutable';

import {checkApiError, parseJSON} from '../util/ApiUtils';

import {getCurrentBudgetId} from '../selectors/StateGetters';

import {loadAccountList} from './AccountActions';
import {loadBudgetInfoById} from './BudgetEntryActions';
import {loadTotalsReport} from './ReportActions';

import {TransactionActionType } from '../constants/Transaction'
import {Transaction} from "../models/Transaction";

export interface TransactionAction extends Action {
    payload: Transaction[];
}

export function loadLastTransactions() {
    return (dispatch) => {
        dispatch({type: TransactionActionType.TransactionsShortListLoad, payload: []})
        const paginationParams = {
            limit: 5
        }
        const periodParams = {
            notLater: moment().format('YYYY-MM-DDT23:59:59')
        }

        const embeddings = {
            embed: 'account'
        }

        const params = Object.assign({}, paginationParams, periodParams, embeddings)

        const url = '/api/transactions' + '?' + jQuery.param(params)

        fetch(url)
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json: any) {
                dispatch({type: TransactionActionType.TransactionsShortListStore, payload: json.transactions})
            })
    }
}

export function createTransaction():TransactionAction {
    return {
      type: TransactionActionType.TransactionCreate,
      payload: []
    }
}

export function editTransaction(tx: Transaction):TransactionAction {
    return {
      type: TransactionActionType.TransactionEdit,
      payload: [tx]
    }
}

export function setCloseOnSave(value) {
    /*return {
      type: TRANSACTION_DIALOG_CLOSESAVE_SET,
      payload: value
    }*/
}

export function editTransactionCancel() {
    /*return {
      type: TRANSACTION_DIALOG_CLOSE,
      payload: true
    }*/
}

export function editTransactionChange(tx) {
    /*return {
      type: TRANSACTION_DIALOG_CHANGE,
      payload: tx
    }*/
}

export function editTransactionSave() {
    /*return (dispatch, getState) => {
      const state = getState()
      if (state.get('transaction').getIn(['dialog', 'closeOnSave'])) {
        dispatch({
          type: TRANSACTION_DIALOG_CLOSE,
          payload: true
        })
      }
      const transaction = state.get('transaction').getIn(['dialog', 'transaction'])
      dispatch(updateTransaction(transaction))
      if (!state.get('transaction').getIn(['dialog', 'closeOnSave'])) {
        dispatch(createTransaction())
      }
    }*/
}

export function updateTransaction(tx) {
    /*return (dispatch, getState) => {
      dispatch({
        type: TRANSACTION_PARTIAL_UPDATE,
        payload: {
          id: tx.get('id', -1),
          tx: tx.set('loading', true)
        }
      })

      const selectedBudgetId = getCurrentBudgetId(getState())

      let url = '/api/transaction'
      let method = 'POST'
      if (tx.has('id')) {
        url = url + '/' + tx.get('id')
        method = 'PUT'
      }

      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/vnd.mdg+json'
        },
        body: JSON.stringify(mapToData(tx.get('id', -1), tx))
      })
        .then(parseJSON)
        .then(singleToMap)
        .then(checkApiError)
        .then(map => {
          if (!tx.has('id')) {
            dispatch(loadTransactionList())
            dispatch(loadLastTransactions())
          } else {
            dispatch({
              type: TRANSACTION_PARTIAL_SUCCESS,
              payload: {
                id: tx.get('id', -1),
                tx: map.first()
              }
            })
          }
        })
        .then(() => dispatch(loadAccountList())) // Reloading accounts will trigger transactions reload
        .then(() => dispatch(loadTotalsReport()))
        .then(() => { if (selectedBudgetId) { dispatch(loadBudgetInfoById(selectedBudgetId)) } })
        .catch(() => dispatch(loadTransactionList()))
    }*/
}

export function markTransaction(id, value) {
    /*return {
      type: value ? TRANSACTION_LIST_SELECT : TRANSACTION_LIST_UNSELECT,
      payload: id
    }*/
}
