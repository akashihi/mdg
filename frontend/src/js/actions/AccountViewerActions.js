import jQuery from 'jquery';

import {checkApiError, parseJSON} from '../util/ApiUtils';
import {loadTransactionList} from './TransactionActions';
import {loadBudgetEntryList} from './BudgetEntryActions';

import {
    GET_ACCOUNTLIST_REQUEST,
    GET_ACCOUNTLIST_SUCCESS,
    GET_ACCOUNTLIST_FAILURE,
    TOGGLE_HIDDEN_ACCOUNTS,
    ACCOUNT_DIALOG_OPEN,
    ACCOUNT_DIALOG_CLOSE,
    ACCOUNT_DIALOG_CHANGE
} from '../constants/Account'

export function loadAccountList() {
    return (dispatch, getState) => {
        dispatch({
            type: GET_ACCOUNTLIST_REQUEST,
            payload: true
        });

        var state = getState();

        var url = '/api/account';

        if (state.account.ui.hiddenAccountsVisible) {
            var filter = {filter: JSON.stringify({hidden: true})};
            url = url + '?' + jQuery.param(filter)
        }

        fetch(url)
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json) {
                dispatch({
                    type: GET_ACCOUNTLIST_SUCCESS,
                    payload: json.data
                })
            })
            .then(() => dispatch(loadTransactionList()))
            .catch(function (response) {
                dispatch({
                    type: GET_ACCOUNTLIST_FAILURE,
                    payload: response.json
                })
            });
    }
}

export function toggleHiddenAccounts(visible) {
    return (dispatch) => {
        dispatch({
            type: TOGGLE_HIDDEN_ACCOUNTS,
            payload: visible
        });

        dispatch(()=>dispatch(loadAccountList()))
    };
}

export function updateAccount(account) {
    return (dispatch, getState) => {
        dispatch({
            type: GET_ACCOUNTLIST_REQUEST,
            payload: true
        });

        var state=getState();
        var selectedBudgetId = state.budgetentry.currentBudget.id;

        var url = '/api/account';
        var method = 'POST';
        if (account.hasOwnProperty('id') && account['id'] ) {
            url = url + '/' + account.id;
            method = 'PUT';
        }

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/vnd.mdg+json'
            },
            body: JSON.stringify({data: account})
        })
            .then(parseJSON)
            .then(checkApiError)
            .then(()=>dispatch(loadAccountList()))
            .then(()=>{if (selectedBudgetId) { dispatch(loadBudgetEntryList(selectedBudgetId))}})
            .catch(()=>dispatch(loadAccountList()))
    }
}

export function createAccount() {
    return {
        type: ACCOUNT_DIALOG_OPEN,
        payload: {
            full: true,
            account: { attributes: {balance: 0} }
        }
    }
}

export function editAccount(account) {
    return {
        type: ACCOUNT_DIALOG_OPEN,
        payload: {
            full: false,
            account: account
        }
    }
}

export function editAccountCancel() {
    return {
        type: ACCOUNT_DIALOG_CLOSE,
        payload: true
    }
}

export function editAccountChange(account) {
    return {
        type: ACCOUNT_DIALOG_CHANGE,
        payload: account
    }
}

export function editAccountSave() {
    return (dispatch, getState) => {
        dispatch({
            type: ACCOUNT_DIALOG_CLOSE,
            payload: true
        });

        var state = getState();
        var account = state.account.dialog.account;
        dispatch(updateAccount(account));
    }
}
