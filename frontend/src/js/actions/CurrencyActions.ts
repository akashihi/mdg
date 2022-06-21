import {Action} from 'redux';
import { checkApiError, parseJSON, dataToMap, mapToData } from '../util/ApiUtils'

import {CurrencyActionType } from '../constants/Currency'
import { loadCategoryList } from './CategoryActions'
import { loadTotalsReport } from './ReportActions'
import Currency from "../models/Currency";

export interface CurrencyAction extends Action {
    payload: Array<Partial<Currency>>;
}

export function loadCurrencyList () {
  return (dispatch) => {
    dispatch({
      type: CurrencyActionType.CurrenciesLoad,
      payload: {}
    })

    fetch('/api/currencies')
      .then(parseJSON)
      .then(checkApiError)
      .then(function (data:any) {
        dispatch({
          type: CurrencyActionType.StoreCurrencies,
          payload: data.currencies
        })
      })
      .then(() => dispatch(loadCategoryList()))
      .then(() => dispatch(loadTotalsReport()))
      .catch(function (response) {
        dispatch({
          type: CurrencyActionType.CurrenciesLoadFail,
          payload: {}
        })
      })
  }
}

export function updateCurrency (id, currency) {
  return (dispatch) => {
    dispatch({
      type: CurrencyActionType.CurrenciesLoad,
      payload: {}
    })

    const url = '/api/currency/' + id
    const method = 'PUT'

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/vnd.mdg+json'
      },
      body: JSON.stringify(mapToData(id, currency))
    })
      .then(parseJSON)
      .then(checkApiError)
      .then(() => dispatch(loadCurrencyList()))
  }
}
