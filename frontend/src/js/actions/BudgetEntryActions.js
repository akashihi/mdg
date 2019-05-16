import {checkApiError, parseJSON, singleToMap, dataToMap, mapToData} from '../util/ApiUtils';

import {
    SET_CURRENT_BUDGET,
    GET_BUDGETENTRYLIST_REQUEST,
    GET_BUDGETENTRYLIST_SUCCESS,
    GET_BUDGETENTRYLIST_FAILURE
} from '../constants/BudgetEntry'

export function loadBudgetInfoById(id) {
    return (dispatch) => {
        dispatch({
            type: GET_BUDGETENTRYLIST_REQUEST,
            payload: true
        });

        fetch('/api/budget/' + id)
            .then(parseJSON)
            .then(checkApiError)
            .then(singleToMap)
            .then(function (map) {
                return map.map((v, k) => v.set('id', k)).first()
            })
            .then(function (map) {
                dispatch({
                    type: SET_CURRENT_BUDGET,
                    payload: map
                });
                dispatch(loadBudgetEntryList(map.get('id')));
            })
    }
}

export function loadBudgetEntryList(budgetId) {
    return (dispatch) => {
        dispatch({
            type: GET_BUDGETENTRYLIST_REQUEST,
            payload: true
        });

        if (budgetId == null) {
            dispatch({
                type: GET_BUDGETENTRYLIST_FAILURE,
                payload: {}
            })
        }
        fetch('/api/budget/' + budgetId + '/entry')
            .then(parseJSON)
            .then(checkApiError)
            .then(dataToMap)
            .then(function (map) {
                dispatch({
                    type: GET_BUDGETENTRYLIST_SUCCESS,
                    payload: map
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

export function updateBudgetEntry(id, entry) {
    return(dispatch, getState) => {
        dispatch({
            type: GET_BUDGETENTRYLIST_REQUEST,
            payload: true
        });

        var state = getState();

        var budgetId = state.budgetentry.get('currentBudget').get('id');

        var url = '/api/budget/' + budgetId + '/entry/' + id;

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/vnd.mdg+json'
            },
            body: JSON.stringify(mapToData(id, entry))
        })
            .then(parseJSON)
            .then(checkApiError)
            .then(()=>dispatch(loadBudgetInfoById(budgetId)))
            .catch(()=>dispatch(loadBudgetInfoById(budgetId)))
    }
}
