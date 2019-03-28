import {checkApiError, parseJSON, dataToMap} from '../util/ApiUtils';

import {GET_CURRENCYLIST_REQUEST, GET_CURRENCYLIST_SUCCESS, GET_CURRENCYLIST_FAILURE} from '../constants/Currency'
import {loadCategoryList} from './CategoryActions'
import {loadTotalsReport} from './ReportActions'

export function loadCurrencyList() {
    return (dispatch) => {
        dispatch({
            type: GET_CURRENCYLIST_REQUEST,
            payload: true
        });

        fetch('/api/currency')
            .then(parseJSON)
            .then(checkApiError)
            .then(dataToMap)
            .then(function (map) {
                dispatch({
                    type: GET_CURRENCYLIST_SUCCESS,
                    payload: map
                });
            })
            .then(() => dispatch(loadCategoryList()))
            .then(() => dispatch(loadTotalsReport()))
            .catch(function (response) {
                dispatch({
                    type: GET_CURRENCYLIST_FAILURE,
                    payload: response.json
                })
            });
    }
}

export function updateCurrency(currency) {
    return (dispatch) => {
        dispatch({
            type: GET_CURRENCYLIST_REQUEST,
            payload: true
        });

        var url = '/api/currency/' + currency.id;
        var method = 'PUT';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/vnd.mdg+json'
            },
            body: JSON.stringify({data: currency})
        })
            .then(parseJSON)
            .then(checkApiError)
            .then(()=>dispatch(loadCurrencyList()))
    }
}
