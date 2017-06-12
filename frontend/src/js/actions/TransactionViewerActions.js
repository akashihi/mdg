import jQuery from 'jquery';

import {checkApiError, parseJSON} from '../util/ApiUtils';

import {
    GET_TRANSACTIONLIST_REQUEST,
    GET_TRANSACTIONLIST_SUCCESS,
    GET_TRANSACTIONLIST_FAILURE,
    SET_TRANSACTION_PAGESIZE,
    GET_TRANSACTION_NEXTPAGE,
    GET_TRANSACTIONLIST_NODATA
} from '../constants/Transaction'

export function loadTransactionList() {
    return (dispatch, getState) => {
        dispatch({
            type: GET_TRANSACTIONLIST_REQUEST,
            payload: true
        });

        var state = getState();

        var paginationParams = jQuery.param({pageSize: state.transaction.ui.pageSize, pageNumber: state.transaction.ui.pageNumber});

        var url = '/api/transaction' + '?' + paginationParams;

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
