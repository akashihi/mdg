import {Action} from 'redux';
import jQuery from 'jquery';
import moment from 'moment';

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

export function closeTransactionDialog():TransactionAction {
    return {
        type: TransactionActionType.TransactionDialogClose,
        payload: []
    }
}
export function updateTransaction(tx:Transaction) {
    return {
        type: TransactionActionType.TransactionSave,
        payload: [tx]
    }
}
