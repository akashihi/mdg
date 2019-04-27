import jQuery from 'jquery';
import moment from 'moment';
import {Map} from 'immutable';

import {checkApiError, parseJSON, dataToMap, mapToData} from '../util/ApiUtils';

import {loadAccountList} from './AccountActions'
import {loadBudgetInfoById} from './BudgetEntryActions';
import {loadTotalsReport} from './ReportActions'

import {
    GET_TRANSACTIONLIST_REQUEST,
    GET_TRANSACTIONLIST_COUNT,
    GET_TRANSACTIONLIST_SUCCESS,
    GET_TRANSACTIONLIST_FAILURE,
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
    TRANSACTION_DIALOG_CLOSESAVE_SET,
    GET_LASTTRANSACTION_SUCCESS,
    SET_TRANSACTION_FILTER
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
            .then(dataToMap)
            .then(function (map) {
                dispatch({
                    type: GET_LASTTRANSACTION_SUCCESS,
                    payload: map
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

        const state = getState();

        const paginationParams = {
            pageSize: state.transactionview.get('pageSize'),
            pageNumber: state.transactionview.get('pageNumber')
        };
        const periodParams = {
            notLater: state.transactionview.get('periodEnd').format('YYYY-MM-DDT23:59:59'),
            notEarlier: state.transactionview.get('periodBeginning').format('YYYY-MM-DDT00:00:00')
        };
        const filter = {
            comment: state.transactionview.get('commentFilter'),
            tag: state.transactionview.get('tagFilter'),
            account_id: state.transactionview.get('accountFilter'),
        };
        const filterParams = {filter: JSON.stringify(filter)};

        const params = Object.assign({}, paginationParams, periodParams, filterParams);

        const url = '/api/transaction' + '?' + jQuery.param(params);

        fetch(url)
            .then(parseJSON)
            .then(checkApiError)
            .then(function(json) {
                dispatch({
                    type: GET_TRANSACTIONLIST_COUNT,
                    payload: json.count
                });
                return json
            })
            .then(dataToMap)
            .then(function (map) {
                dispatch({
                    type: GET_TRANSACTIONLIST_SUCCESS,
                    payload: map
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

export function setTransactionFilter(key, value, reload) {
    return (dispatch) => {
        dispatch({
            type: SET_TRANSACTION_FILTER,
            key: key,
            payload: value
        });
        if (reload) {
            dispatch(loadTransactionList())
        }
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

export function deleteTransactionRequest(id, tx) {
    return {
        type: DELETE_TRANSACTION_REQUEST,
        payload: {
            id: id,
            tx: tx
        }
    }
}

export function deleteTransactionCancel() {
    return {
        type: DELETE_TRANSACTION_CANCEL,
        payload: false
    }
}

export function deleteTransaction(id) {
    return (dispatch) => {
        dispatch({
            type: DELETE_TRANSACTION_APPROVE,
            payload: id
        });

        var url = '/api/transaction/' + id;

        fetch(url, {method: 'DELETE'})
            .then(function(response) {
                if (response.status === 204) {
                    dispatch({
                        type: DELETE_TRANSACTION_SUCCESS,
                        payload: id
                    })
                }
            })
            .then(parseJSON)
            .then(checkApiError)
            .then(()=>dispatch(loadAccountList())) //Reloading accounts will trigger transactions reload
            .then(()=>dispatch(loadTotalsReport()))
            .catch(function (response) {
                dispatch({
                    type: DELETE_TRANSACTION_FAILURE,
                    payload: response.json
                })
            });
    }
}

export function setCloseOnSave(value) {
  return {
    type: TRANSACTION_DIALOG_CLOSESAVE_SET,
    payload: value
  }
}

export function createTransaction() {
    return {
        type: TRANSACTION_DIALOG_OPEN,
        payload: {
            id: -1,
            tx: Map({
                comment: '',
                timestamp: moment().format('YYYY-MM-DDTHH:mm:ss'),
                tags: [],
                operations: [ {amount: 0, account_id: -1}, {amount: 0, account_id: -1}]})
        }
    }
}

export function editTransaction(id, tx) {
    return {
        type: TRANSACTION_DIALOG_OPEN,
        payload: {
            id: id,
            tx: tx
        }
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
      const state = getState();
      if (state.transaction.getIn(['dialog', 'closeOnSave'])) {
        dispatch({
            type: TRANSACTION_DIALOG_CLOSE,
            payload: true
        });
      }
        const id = state.transaction.getIn(['dialog', 'id']);
        const transaction = state.transaction.getIn(['dialog', 'transaction']);
        dispatch(updateTransaction(id, transaction));
        if (!state.transaction.getIn(['dialog', 'closeOnSave'])) {
          dispatch(createTransaction())
        }
    }
}

export function updateTransaction(id, tx) {
    return (dispatch, getState) => {
        dispatch({
            type: GET_TRANSACTIONLIST_REQUEST,
            payload: true
        });

        var state=getState();
        var selectedBudgetId = state.budgetentry.currentBudget.id;

        var url = '/api/transaction';
        var method = 'POST';
        if (id != -1) {
            url = url + '/' + id;
            method = 'PUT';
        }

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/vnd.mdg+json'
            },
            body: JSON.stringify(mapToData(id, tx))
        })
            .then(parseJSON)
            .then(checkApiError)
            .then(()=>dispatch(loadAccountList())) //Reloading accounts will trigger transactions reload
            .then(()=>dispatch(loadTotalsReport()))
            .then(()=>{if (selectedBudgetId) { dispatch(loadBudgetInfoById(selectedBudgetId))}})
            .catch(()=>dispatch(loadTransactionList()))
    }
}
