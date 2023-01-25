import moment from 'moment';

import { wrap } from './base';
import * as API from '../api/api';
import {
    AddNewBudget,
    RemoveBudget, StoreAdditionalBudgets,
    StoreCurrentBudget,
    StoreLoadedBudgets,
    StoreSelectedBudget
} from '../reducers/BudgetReducer';
import { NotifyError } from '../reducers/ErrorReducer';
import {ShortBudget} from "../api/models/Budget";

export function loadCurrentBudget() {
    return wrap(async dispatch => {
        const id = parseInt(moment().format('YYYYMMDD'));
        const result = await API.loadBudget(id);
        if (result.ok) {
            dispatch(StoreCurrentBudget(result.val));
        } else {
            dispatch(NotifyError(result.val));
        }
    });
}

export function loadSelectedBudget(id: number) {
    return wrap(async dispatch => {
        const result = await API.loadBudget(id);
        if (result.ok) {
            dispatch(StoreSelectedBudget(result.val));
        } else {
            dispatch(NotifyError(result.val));
        }
    });
}

export function loadInitialBudgets() {
    return wrap(async dispatch => {
        const result = await API.listBudgets(6); //Half a year
        if (result.ok) {
            dispatch(StoreLoadedBudgets({data: result.val.budgets, next: result.val.next, left: result.val.left}));
        } else {
            dispatch(NotifyError(result.val));
        }
    })
}

export function deleteBudget(id: number) {
    return wrap(async (dispatch,getState) => {
        const result = await API.deleteBudget(id);
        if (result.some) {
            dispatch(RemoveBudget(id));
            dispatch(loadCurrentBudget());
            dispatch(loadCurrentBudget());
            if (getState().budget.budgets.length !== 0) {
                dispatch(loadSelectedBudget(getState().budget.budgets[0].id));
            }
        }
    })
}

export function createBudget(budget: ShortBudget) {
    return wrap(async dispatch => {
        const result = await API.saveBudget(budget);
        if (result.ok) {
            dispatch(AddNewBudget(result.val));
            dispatch(loadSelectedBudget(result.val.id));
        } else {
            dispatch(NotifyError(result.val));
        }
    })
}

export function loadNextBudgetPage() {
    return wrap(async (dispatch,getState) => {
        const result = await API.loadBudgets(getState().budget.budgetCursorNext);
        if (result.ok) {
            dispatch(StoreAdditionalBudgets({data: result.val.budgets, next: result.val.next, left: result.val.left}));
        }
    })
}
