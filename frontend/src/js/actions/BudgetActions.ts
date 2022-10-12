import moment from 'moment';

import { wrap } from './base';
import * as API from '../api/api';
import {StoreCurrentBudget, StoreSelectedBudget} from "../reducers/BudgetReducer";
import {NotifyError} from "../reducers/ErrorReducer";

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
