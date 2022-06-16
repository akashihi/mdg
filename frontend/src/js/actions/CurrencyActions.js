import {checkApiError, parseJSON, dataToMap, mapToData} from '../util/ApiUtils';

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

export function updateCurrency(id, currency) {
    return (dispatch) => {
        dispatch({
            type: GET_CURRENCYLIST_REQUEST,
            payload: true
        });

        var url = '/api/currency/' + id;
        var method = 'PUT';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/vnd.mdg+json'
            },
            body: JSON.stringify(mapToData(id, currency))
        })
            .then(parseJSON)
            .then(checkApiError)
            .then(()=>dispatch(loadCurrencyList()))
    }
}
