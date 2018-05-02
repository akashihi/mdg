import jQuery from 'jquery';
import moment from 'moment';

import {checkApiError, parseJSON} from '../util/ApiUtils';

import {loadAccountList} from './AccountViewerActions'
import {loadBudgetInfoById} from './BudgetEntryActions';

import {
    GET_TRANSACTIONLIST_REQUEST,
    GET_TRANSACTIONLIST_SUCCESS,
    GET_TRANSACTIONLIST_FAILURE,
    SET_TRANSACTION_PAGESIZE,
    SET_TRANSACTION_PAGENO,
    SET_TRANSACTION_VIEW_PERIOD,
    SET_TRANSACTION_VIEW_BEGINNING,
    SET_TRANSACTION_VIEW_END,
    SET_TRANSACTION_FILTER_ACCOUNT,
    SET_TRANSACTION_FILTER_TAG,
    SET_TRANSACTION_FILTER_COMMENT,
    CLEAR_TRANSACTION_FILTER,
    APPLY_TRANSACTION_FILTER,
    DELETE_TRANSACTION_REQUEST,
    DELETE_TRANSACTION_CANCEL,
    DELETE_TRANSACTION_APPROVE,
    DELETE_TRANSACTION_SUCCESS,
    DELETE_TRANSACTION_FAILURE,
    TRANSACTION_DIALOG_OPEN,
    TRANSACTION_DIALOG_CLOSE,
    TRANSACTION_DIALOG_CHANGE,
    GET_LASTTRANSACTION_SUCCESS
} from '../constants/Transaction'

export function loadLastTransactions() {
    return (dispatch) => {
        var paginationParams = {
            pageSize: 5,
            pageNumber: 1
        };
        var periodParams = {
            notLater: moment().format('YYYY-MM-DDT23:59:59'),
        };

        var params = Object.assign({}, paginationParams, periodParams);

        var url = '/api/transaction' + '?' + jQuery.param(params);

        fetch(url)
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json) {
                dispatch({
                    type: GET_LASTTRANSACTION_SUCCESS,
                    payload: json
                })
            });
    }
}

export function loadTransactionList() {
    return (dispatch, getState) => {
        dispatch({
            type: GET_TRANSACTIONLIST_REQUEST,
            payload: true
        });

        var state = getState();

        var paginationParams = {
            pageSize: state.transactionview.pageSize,
            pageNumber: state.transactionview.pageNumber
        };
        var periodParams = {
            notLater: state.transactionview.periodEnd.format('YYYY-MM-DDT23:59:59'),
            notEarlier: state.transactionview.periodBeginning.format('YYYY-MM-DDT00:00:00')
        };
        var filter = {
            comment: state.transactionview.commentFilter,
            tag: state.transactionview.tagFilter,
            account_id: state.transactionview.accountFilter,
        };
        var filterParams = {filter: JSON.stringify(filter)};

        var params = Object.assign({}, paginationParams, periodParams, filterParams);

        var url = '/api/transaction' + '?' + jQuery.param(params);

        fetch(url)
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json) {
                dispatch({
                    type: GET_TRANSACTIONLIST_SUCCESS,
                    payload: json
                });
                dispatch(loadLastTransactions())
            })
            .catch(function (response) {
                dispatch({
                    type: GET_TRANSACTIONLIST_FAILURE,
                    payload: response.json
                })
            });
    }
}

export function setTransactionPageSize(size) {
    return (dispatch) => {
        dispatch({
            type: SET_TRANSACTION_PAGESIZE,
            payload: size
        });
        dispatch(loadTransactionList())
    }
}

export function setTransactionPage(page) {
    return (dispatch) => {
        dispatch({
            type: SET_TRANSACTION_PAGENO,
            payload: page
        });
        dispatch(loadTransactionList())
    }
}

export function setTransactionViewPeriod(days) {
    return (dispatch) => {
        dispatch({
            type: SET_TRANSACTION_VIEW_PERIOD,
            payload: {
                beginning: moment().subtract(days, 'days'),
                end: moment()
            }
        });
        dispatch(loadTransactionList())
    }
}

export function setTransactionViewBeginning(value) {
    return (dispatch) => {
        dispatch({
            type: SET_TRANSACTION_VIEW_BEGINNING,
            payload: moment(value)
        });
        dispatch(loadTransactionList())
    }
}

export function setTransactionViewEnd(value) {
    return (dispatch) => {
        dispatch({
            type: SET_TRANSACTION_VIEW_END,
            payload: moment(value)
        });
        dispatch(loadTransactionList())
    }
}

export function setTransactionFilterAccount(values) {
    return {
        type: SET_TRANSACTION_FILTER_ACCOUNT,
        payload: values
    }
}

export function setTransactionFilterTag(values) {
    return {
        type: SET_TRANSACTION_FILTER_TAG,
        payload: values
    }
}

export function setTransactionFilterComment(values) {
    return {
        type: SET_TRANSACTION_FILTER_COMMENT,
        payload: values
    }
}

export function transactionFilterClear() {
    return (dispatch) => {
        dispatch({
            type: CLEAR_TRANSACTION_FILTER,
            payload: true
        });
        dispatch(loadTransactionList())
    }
}

export function transactionFilterApply() {
    return (dispatch) => {
        dispatch({
            type: APPLY_TRANSACTION_FILTER,
            payload: true
        });
        dispatch(loadTransactionList())
    }
}

export function deleteTransactionRequest(tx) {
    return {
        type: DELETE_TRANSACTION_REQUEST,
        payload: tx
    }
}

export function deleteTransactionCancel() {
    return {
        type: DELETE_TRANSACTION_CANCEL,
        payload: false
    }
}

export function deleteTransaction(tx) {
    return (dispatch) => {
        dispatch({
            type: DELETE_TRANSACTION_APPROVE,
            payload: tx
        });

        var url = '/api/transaction/' + tx.id;

        fetch(url, {method: 'DELETE'})
            .then(function(response) {
                if (response.status == 204) {
                    dispatch({
                        type: DELETE_TRANSACTION_SUCCESS,
                        payload: tx
                    })
                }
            })
            .then(parseJSON)
            .then(checkApiError)
            .then(()=>dispatch(loadAccountList())) //Reloading accounts will trigger transactions reload
            .catch(function (response) {
                dispatch({
                    type: DELETE_TRANSACTION_FAILURE,
                    payload: response.json
                })
            });
    }
}

export function createTransaction() {
    return {
        type: TRANSACTION_DIALOG_OPEN,
        payload: { type: 'transaction', attributes: {comment: '', timestamp: moment().format('YYYY-MM-DDTHH:mm:ss'), tags: [], operations: [ {amount: 0}, {amount: 0}]} }
    }
}

export function editTransaction(tx) {
    return {
        type: TRANSACTION_DIALOG_OPEN,
        payload: tx
    }
}

export function editTransactionCancel() {
    return {
        type: TRANSACTION_DIALOG_CLOSE,
        payload: true
    }
}

export function editTransactionChange(tx) {
    return {
        type: TRANSACTION_DIALOG_CHANGE,
        payload: tx
    }
}

export function editTransactionSave() {
    return (dispatch, getState) => {
        dispatch({
            type: TRANSACTION_DIALOG_CLOSE,
            payload: true
        });

        var state = getState();
        var transaction = state.transaction.dialog.transaction;
        dispatch(updateTransaction(transaction));
    }
}

export function updateTransaction(tx) {
    return (dispatch, getState) => {
        dispatch({
            type: GET_TRANSACTIONLIST_REQUEST,
            payload: true
        });

        var state=getState();
        var selectedBudgetId = state.budgetentry.currentBudget.id;

        var url = '/api/transaction';
        var method = 'POST';
        if (tx.hasOwnProperty('id') && tx['id'] ) {
            url = url + '/' + tx.id;
            method = 'PUT';
        }

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/vnd.mdg+json'
            },
            body: JSON.stringify({data: tx})
        })
            .then(parseJSON)
            .then(checkApiError)
            .then(()=>dispatch(loadAccountList())) //Reloading accounts will trigger transactions reload
            .then(()=>{if (selectedBudgetId) { dispatch(loadBudgetInfoById(selectedBudgetId))}})
            .catch(()=>dispatch(loadTransactionList()))
    }
}
