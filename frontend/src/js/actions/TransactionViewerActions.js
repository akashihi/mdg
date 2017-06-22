import jQuery from 'jquery';
import moment from 'moment';

import {checkApiError, parseJSON} from '../util/ApiUtils';

import {
    GET_TRANSACTIONLIST_REQUEST,
    GET_TRANSACTIONLIST_SUCCESS,
    GET_TRANSACTIONLIST_FAILURE,
    SET_TRANSACTION_PAGESIZE,
    GET_TRANSACTION_NEXTPAGE,
    GET_TRANSACTIONLIST_NODATA,
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
    TRANSACTION_DIALOG_OPEN
} from '../constants/Transaction'

export function loadTransactionList() {
    return (dispatch, getState) => {
        dispatch({
            type: GET_TRANSACTIONLIST_REQUEST,
            payload: true
        });

        var state = getState();

        var paginationParams = {
            pageSize: state.transaction.ui.pageSize,
            pageNumber: state.transaction.ui.pageNumber
        };
        var periodParams = {
            notLater: state.transaction.ui.periodBeginning.format('YYYY-MM-DDT00:00:00'),
            notEarlier: state.transaction.ui.periodEnd.format('YYYY-MM-DDT00:00:00')
        };
        var filter = {
            comment: state.transaction.ui.commentFilter,
            tag: state.transaction.ui.tagFilter,
            account_id: state.transaction.ui.accountFilter,
        };
        var filterParams = {filter: JSON.stringify(filter)};

        var params = Object.assign({}, paginationParams, periodParams, filterParams);

        var url = '/api/transaction' + '?' + jQuery.param(params);

        fetch(url)
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json) {
                if (json.data.length == 0) {
                    dispatch({
                        type: GET_TRANSACTIONLIST_NODATA,
                        payload: true
                    })
                } else {
                    dispatch({
                        type: GET_TRANSACTIONLIST_SUCCESS,
                        payload: json.data
                    })
                }
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

export function nextTransactionPage() {
    return (dispatch) => {
        dispatch({
            type: GET_TRANSACTION_NEXTPAGE,
            payload: true
        });
        dispatch(loadTransactionList())
    }
}

export function setTransactionViewPeriod(days) {
    return (dispatch) => {
        dispatch({
            type: SET_TRANSACTION_VIEW_PERIOD,
            payload: {
                beginning: moment(),
                end: moment().subtract(days, 'days')
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
            .catch(function (response) {
                dispatch({
                    type: DELETE_TRANSACTION_FAILURE,
                    payload: response.json
                })
            });
    }
}

export function editTransaction(tx) {
    return {
        type: TRANSACTION_DIALOG_OPEN,
        payload: tx
    }
}
