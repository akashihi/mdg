import { Action } from 'redux';
import jQuery from 'jquery';
import moment from 'moment';

import { processApiResponse } from '../util/ApiUtils';

import { TransactionActionType } from '../constants/Transaction';
import { Transaction } from '../models/Transaction';

export interface TransactionAction extends Action {
    payload: Transaction[];
}

export function loadLastTransactions() {
    return dispatch => {
        dispatch({ type: TransactionActionType.TransactionsShortListLoad, payload: [] });
        const paginationParams = {
            limit: 5,
        };
        const periodParams = {
            notLater: moment().format('YYYY-MM-DDT23:59:59'),
        };

        const embeddings = {
            embed: 'account',
        };

        const params = Object.assign({}, paginationParams, periodParams, embeddings);

        const url = '/api/transactions' + '?' + jQuery.param(params);

        fetch(url)
            .then(processApiResponse)
            .then(function (json) {
                dispatch({ type: TransactionActionType.TransactionsShortListStore, payload: json.transactions });
            });
    };
}

export function createTransaction(): TransactionAction {
    return {
        type: TransactionActionType.TransactionCreate,
        payload: [],
    };
}

export function editTransaction(tx: Transaction): TransactionAction {
    return {
        type: TransactionActionType.TransactionEdit,
        payload: [tx],
    };
}

export function closeTransactionDialog(): TransactionAction {
    return {
        type: TransactionActionType.TransactionDialogClose,
        payload: [],
    };
}
export function updateTransaction(tx: Transaction) {
    return dispatch => {
        dispatch({ type: TransactionActionType.TransactionSave, payload: [tx] });
        dispatch(createTransaction());
    };
}
