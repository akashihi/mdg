import moment from 'moment';
import {checkApiError, parseJSON, dateToYMD, dataToMap} from '../util/ApiUtils';

import {
    TOGGLE_BUDGET_SELECTOR,
    GET_BUDGETLIST_REQUEST,
    GET_BUDGETLIST_SUCCESS,
    GET_BUDGETLIST_FAILURE,
    SET_NEWBUDGET_BEGIN,
    SET_NEWBUDGET_END,
    TOGGLE_HIDDEN_ENTRIES
} from '../constants/Budget'

import {loadBudgetInfoById} from './BudgetEntryActions'

export function toggleBudgetSelector(visible) {
    return {
        type: TOGGLE_BUDGET_SELECTOR,
        payload: visible
    }
}

export function toggleHiddenEntries(visible) {
    return (dispatch) => {
        dispatch({
            type: TOGGLE_HIDDEN_ENTRIES,
            payload: visible
        });

        //dispatch(()=>dispatch(getCurrentBudget()))
    };
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
            .then(dataToMap)
            .then(function (map) {
                dispatch({
                    type: GET_BUDGETLIST_SUCCESS,
                    payload: map
                });
                dispatch(getCurrentBudget());
            })
            .catch(function (response) {
                console.log(response);
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

        fetch('/api/budget/' + id, {method: 'DELETE'})
            .then(parseJSON)
            .then(checkApiError)
            .then(()=>dispatch(loadBudgetList()))
            .catch(()=>dispatch(loadBudgetList()))
    }
}

export function budgetSetNewBegin(dt) {
    return {
        type: SET_NEWBUDGET_BEGIN,
        payload: dt
    };
}

export function budgetSetNewEnd(dt) {
    return {
        type: SET_NEWBUDGET_END,
        payload: dt
    }
}

export function budgetCreate() {
    return (dispatch, getState) => {
        dispatch({
            type: GET_BUDGETLIST_REQUEST,
            payload: true
        });

        var state = getState();

        var json = {
            data: {
                type: 'budget',
                attributes: {
                    term_beginning: dateToYMD(state.budget.newBudgetBegin),
                    term_end: dateToYMD(state.budget.newBudgetEnd)
                }
            }
        };

        fetch('/api/budget', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.mdg+json'
            },
            body: JSON.stringify(json)
        })
            .then(parseJSON)
            .then(checkApiError)
            .then(()=>dispatch(loadBudgetList()))
            .catch(()=>dispatch(loadBudgetList()))
    }
}

export function getCurrentBudget() {
    return (dispatch) => {
        var id = moment().format('YYYYMMDD');
        dispatch(loadBudgetInfoById(id));
    }
}

export function selectBudget(budget) {
    return (dispatch) => {
        dispatch(loadBudgetInfoById(budget.id));
    }
}
