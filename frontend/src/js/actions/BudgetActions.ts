import { Action } from 'redux';
import moment from 'moment';

import { BudgetActionType } from '../constants/Budget';

import { Budget } from '../api/models/Budget';
import {wrap} from "./base";
import * as API from '../api/api';

export interface BudgetAction extends Action {
    payload?: Budget;
}

export function loadCurrentBudget() {
    return wrap(async dispatch => {
        const id = parseInt(moment().format('YYYYMMDD'));
        const result = await API.loadBudget(id);
        if (result.ok) {
            dispatch({ type: BudgetActionType.StoreCurrentBudget, payload: result.val });
        }
    });
}

export function loadSelectedBudget(id: number) {
    return wrap(async dispatch => {
        const result = await API.loadBudget(id);
        if (result.ok) {
            dispatch({ type: BudgetActionType.StoreSelectedBudget, payload: result.val });
        }
    });
}
