import jQuery from 'jquery';

import {checkApiError, parseJSON} from '../util/ApiUtils';

import { GET_ACCOUNTLIST_REQUEST, GET_ACCOUNTLIST_SUCCESS, GET_ACCOUNTLIST_FAILURE, TOGGLE_HIDDEN_ACCOUNTS} from '../constants/Account'

export function loadAccountList() {
    return (dispatch, getState) => {
        dispatch({
            type: GET_ACCOUNTLIST_REQUEST,
            payload: true
        });

        var state = getState();

        var url = '/api/account';

        if (state.account.ui.hiddenAccountsVisible) {
            var filter = {filter: JSON.stringify({ hidden: true})};
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
