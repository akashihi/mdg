import { Action } from 'redux';
import { produce } from 'immer';

import { CurrencyActionType } from '../constants/Currency';
import { loadCategoryList } from './CategoryActions';
import { loadTotalsReport } from './ReportActions';
import {Currency} from '../api/model';
import {wrap} from "./base";
import * as API from "../api/api";

export interface CurrencyAction extends Action {
    payload: Currency[];
}

export function loadCurrencyList() {
    return wrap(async dispatch => {
        dispatch({
            type: CurrencyActionType.CurrenciesLoad,
            payload: {},
        });
        const result = await API.listCurrencies()
        if (result.ok) {
            dispatch({ type: CurrencyActionType.StoreCurrencies, payload: result.val });
            await dispatch(loadCategoryList());
            await dispatch(loadTotalsReport());
        } else {
            dispatch({ type: CurrencyActionType.CurrenciesLoadFail, payload: result.val });
        }
    });
}

export function updateCurrency(isActive: boolean, currency?: Currency) {
    return wrap(async dispatch => {
        if (currency === undefined) {
            return;
        }
        dispatch({ type: CurrencyActionType.CurrenciesLoad, payload: {} });

        const updatedCurrency: Currency = produce(draft => {
            draft.active = isActive;
        })(currency);
        const result = await API.saveCurrency(updatedCurrency);
        if (result.ok) {
            dispatch({ type: CurrencyActionType.CurrencyStatusUpdate, payload: [result.val] })
        } else {
            dispatch({ type: CurrencyActionType.CurrencyUpdateFail, payload: result.val });
        }
    });
}
