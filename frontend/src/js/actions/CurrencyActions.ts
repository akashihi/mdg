import { Action } from 'redux';
import { produce } from 'immer';
import { processApiResponse } from '../util/ApiUtils';

import { CurrencyActionType } from '../constants/Currency';
import { loadCategoryList } from './CategoryActions';
import { loadTotalsReport } from './ReportActions';
import Currency from '../models/Currency';

export interface CurrencyAction extends Action {
    payload: Currency[];
}

export function loadCurrencyList() {
    return dispatch => {
        dispatch({
            type: CurrencyActionType.CurrenciesLoad,
            payload: {},
        });

        fetch('/api/currencies')
            .then(processApiResponse)
            .then(function (data) {
                dispatch({
                    type: CurrencyActionType.StoreCurrencies,
                    payload: data.currencies,
                });
            })
            .then(() => dispatch(loadCategoryList()))
            .then(() => dispatch(loadTotalsReport()))
            .catch(function () {
                dispatch({ type: CurrencyActionType.CurrenciesLoadFail, payload: {} });
            });
    };
}

export function updateCurrency(currency: Currency, isActive: boolean) {
    return dispatch => {
        if (currency === undefined) {
            return;
        }
        dispatch({ type: CurrencyActionType.CurrenciesLoad, payload: {} });

        const updatedCurrency: Currency = produce(draft => {
            draft.active = isActive;
        })(currency);

        const url = `/api/currencies/${currency.id}`;
        const method = 'PUT';

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/vnd.mdg+json;version=1',
            },
            body: JSON.stringify(updatedCurrency),
        })
            .then(processApiResponse)
            .then((data) =>
                dispatch({ type: CurrencyActionType.CurrencyStatusUpdate, payload: [data as Currency] })
            );
    };
}
