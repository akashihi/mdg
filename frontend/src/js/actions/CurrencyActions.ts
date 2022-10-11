import { produce } from 'immer';

import { loadCategoryList } from './CategoryActions';
import { loadTotalsReport } from './ReportActions';
import { Currency } from '../api/model';
import { wrap } from './base';
import * as API from '../api/api';
import {CurrenciesLoad, CurrenciesStore, CurrencyStatusUpdate} from "../reducers/CurrencyReducer";
import {NotifyError} from "../reducers/ErrorReducer";

export function loadCurrencyList() {
    return wrap(async dispatch => {
        dispatch(CurrenciesLoad());
        const result = await API.listCurrencies();
        if (result.ok) {
            dispatch(CurrenciesStore(result.val));
            await dispatch(loadCategoryList());
            await dispatch(loadTotalsReport());
        } else {
            dispatch(NotifyError(result.val));
        }
    });
}

export function updateCurrency(isActive: boolean, currency?: Currency) {
    return wrap(async dispatch => {
        if (currency === undefined) {
            return;
        }
        dispatch(CurrenciesLoad());

        const updatedCurrency: Currency = produce(draft => {
            draft.active = isActive;
        })(currency);
        const result = await API.saveCurrency(updatedCurrency);
        if (result.ok) {
            dispatch(CurrencyStatusUpdate(result.val));
        } else {
            dispatch(NotifyError(result.val));
        }
    });
}
