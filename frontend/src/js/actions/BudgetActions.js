import moment from 'moment';
import {checkApiError, parseJSON, dateToYMD, dataToMap} from '../util/ApiUtils';

import {
    GET_BUDGETLIST_REQUEST,
    GET_BUDGETLIST_SUCCESS,
    GET_BUDGETLIST_FAILURE,
    TOGGLE_HIDDEN_ENTRIES
} from '../constants/Budget'

import {loadBudgetInfoById} from './BudgetEntryActions'

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

export function budgetCreate(begin, end) {
    return (dispatch) => {
        dispatch({
            type: GET_BUDGETLIST_REQUEST,
            payload: true
        });

        const json = {
            data: {
                type: 'budget',
                attributes: {
                    term_beginning: dateToYMD(begin),
                    term_end: dateToYMD(end)
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

export function selectBudget(id) {
    return (dispatch) => {
        dispatch(loadBudgetInfoById(id));
    }
}
