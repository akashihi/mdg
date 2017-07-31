import moment from 'moment';
import {checkApiError, parseJSON, dateToYMD} from '../util/ApiUtils';

import {
    TOGGLE_BUDGET_SELECTOR,
    GET_BUDGETLIST_REQUEST,
    GET_BUDGETLIST_SUCCESS,
    GET_BUDGETLIST_FAILURE,
    SET_NEWBUDGET_BEGIN,
    SET_NEWBUDGET_END
} from '../constants/Budget'

import {
    SET_CURRENT_BUDGET,
    GET_BUDGETENTRYLIST_REQUEST
} from '../constants/BudgetEntry'

import {loadBudgetEntryList} from './BudgetEntryActions'

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
            .then(function (json) {
                dispatch({
                    type: GET_BUDGETLIST_SUCCESS,
                    payload: json.data
                });
                dispatch(getCurrentBudget());
            })
            .catch(function (response) {
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
        dispatch({
            type: GET_BUDGETENTRYLIST_REQUEST,
            payload: true
        });

        var id = moment().format('YYYYMMDD');

        fetch('/api/budget/' + id)
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json) {
                console.log(json)

                dispatch(selectBudget(json.data));
            })
    }
}

export function selectBudget(budget) {
    return (dispatch) => {
        dispatch({
            type: SET_CURRENT_BUDGET,
            payload: budget
        });
        dispatch(loadBudgetEntryList());
    }
}
