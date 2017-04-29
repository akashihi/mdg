import {checkApiError, parseJSON} from '../util/ApiUtils';

import {
    TOGGLE_BUDGET_SELECTOR,
    GET_BUDGETLIST_REQUEST,
    GET_BUDGETLIST_SUCCESS,
    GET_BUDGETLIST_FAILURE
} from '../constants/Budget'

export function toggleBudgetSelector(visible) {
    return {
        type: TOGGLE_BUDGET_SELECTOR,
        payload: visible
    }
}

export function loadBudgetList() {
    return (dispatch) => {
        dispatch({
            type: GET_BUDGETLIST_REQUEST,
            payload: true
        });

        fetch('/api/budget')
            .then(parseJSON)
            .then(checkApiError)
            .then(function(json) {
                dispatch({
                    type: GET_BUDGETLIST_SUCCESS,
                    payload: json.data
                })
            })
            .catch(function (response) {
                console.log(response)
                dispatch({
                    type: GET_BUDGETLIST_FAILURE,
                    payload: response.json
                })
            });
    }
}

export function deleteBudget(id) {
    return (dispatch) => {
        dispatch({
            type: GET_BUDGETLIST_REQUEST,
            payload: true
        });

        fetch('/api/budget/'+id, {method: 'DELETE'})
            .then(parseJSON)
            .then(checkApiError)
            .then(()=>dispatch(loadBudgetList()))
            .catch(()=>dispatch(loadBudgetList()))
    }
}
