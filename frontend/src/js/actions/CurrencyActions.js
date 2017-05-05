import {checkApiError, parseJSON} from '../util/ApiUtils';

import {GET_CURRENCYLIST_REQUEST, GET_CURRENCYLIST_SUCCESS, GET_CURRENCYLIST_FAILURE} from '../constants/Currency'
import {loadAccountList} from './AccountViewerActions'

export function loadCurrencyList() {
    return (dispatch) => {
        dispatch({
            type: GET_CURRENCYLIST_REQUEST,
            payload: true
        });

        fetch('/api/currency')
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json) {
                dispatch({
                    type: GET_CURRENCYLIST_SUCCESS,
                    payload: json.data
                });
            })
            .then(() => dispatch(loadAccountList()))
            .catch(function (response) {
                dispatch({
                    type: GET_CURRENCYLIST_FAILURE,
                    payload: response.json
                })
            });
    }
}
