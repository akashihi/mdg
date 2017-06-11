import jQuery from 'jquery';

import {checkApiError, parseJSON} from '../util/ApiUtils';

import {
    GET_TRANSACTIONLIST_REQUEST,
    GET_TRANSACTIONLIST_SUCCESS,
    GET_TRANSACTIONLIST_FAILURE,
    SET_TRANSACTION_PAGESIZE
} from '../constants/Transaction'

export function loadTransactionList() {
    return (dispatch, getState) => {
        dispatch({
            type: GET_TRANSACTIONLIST_REQUEST,
            payload: true
        });

        var state = getState();

        var url = '/api/transaction' + '?' + jQuery.param({pageSize: state.transaction.ui.pageSize});

        fetch(url)
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json) {
                dispatch({
                    type: GET_TRANSACTIONLIST_SUCCESS,
                    payload: json.data
                })
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
