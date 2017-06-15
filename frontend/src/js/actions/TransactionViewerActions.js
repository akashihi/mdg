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
    SET_TRANSACTION_FILTER_ACCOUNT
} from '../constants/Transaction'

export function loadTransactionList() {
    return (dispatch, getState) => {
        dispatch({
            type: GET_TRANSACTIONLIST_REQUEST,
            payload: true
        });

        var state = getState();

        var paginationParams = {pageSize: state.transaction.ui.pageSize, pageNumber: state.transaction.ui.pageNumber};
        var periodParams = {notLater: state.transaction.ui.periodBeginning.format('YYYY-MM-DDT00:00:00'), notEarlier: state.transaction.ui.periodEnd.format('YYYY-MM-DDT00:00:00')};

        var params = Object.assign({}, paginationParams, periodParams);

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
