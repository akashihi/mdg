import {checkApiError, parseJSON} from '../util/ApiUtils';

import {
    GET_BUDGETENTRYLIST_REQUEST,
    GET_BUDGETENTRYLIST_SUCCESS,
    GET_BUDGETENTRYLIST_FAILURE
} from '../constants/BudgetEntry'

export function loadBudgetEntryList() {
    return (dispatch, getState) => {
        dispatch({
            type: GET_BUDGETENTRYLIST_REQUEST,
            payload: true
        });

        var state = getState();

        var budgetId = state.budgetentry.currentBudget.id;
        if (budgetId == null) {
            dispatch({
                type: GET_BUDGETENTRYLIST_FAILURE,
                payload: {}
            })
        }
        fetch('/api/budget/' + budgetId + '/entry')
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json) {
                dispatch({
                    type: GET_BUDGETENTRYLIST_SUCCESS,
                    payload: json.data
                });
            })
            .catch(function (response) {
                dispatch({
                    type: GET_BUDGETENTRYLIST_FAILURE,
                    payload: response.json
                })
            });
    }
}

export function updateBudgetEntry(entry) {
    return(dispatch, getState) => {
        dispatch({
            type: GET_BUDGETENTRYLIST_REQUEST,
            payload: true
        });

        var state = getState();

        var budgetId = state.budgetentry.currentBudget.id;

        var url = '/api/budget/' + budgetId + '/entry/' + entry.id;
        var method = 'PUT';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/vnd.mdg+json'
            },
            body: JSON.stringify({data: entry})
        })
            .then(parseJSON)
            .then(checkApiError)
            .then(()=>dispatch(loadBudgetEntryList()))
            .catch(()=>dispatch(loadBudgetEntryList()))
    }
}
