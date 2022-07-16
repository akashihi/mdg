import { Action } from 'redux';
import moment from 'moment';
import { checkApiError, parseJSON } from '../util/ApiUtils';

import { BudgetActionType } from '../constants/Budget';

import { Budget } from '../models/Budget';

export interface BudgetAction extends Action {
    payload?: Budget;
}

export function loadCurrentBudget() {
    return dispatch => {
        const id = moment().format('YYYYMMDD');
        fetch(`/api/budgets/${id}`)
            .then(parseJSON)
            .then(checkApiError)
            .then((json: any) => {
                dispatch({ type: BudgetActionType.StoreCurrentBudget, payload: json as Budget });
            });
    };
}

export function loadSelectedBudget(id) {
    return dispatch => {
        fetch(`/api/budgets/${id}`)
            .then(parseJSON)
            .then(checkApiError)
            .then((json: any) => {
                dispatch({ type: BudgetActionType.StoreSelectedBudget, payload: json as Budget });
            });
    };
}
