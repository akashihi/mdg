import {checkApiError, parseJSON} from '../util/ApiUtils';

import { GET_ACCOUNTIST_REQUEST, GET_ACCOUNTLIST_SUCCESS, GET_ACCOUNTLIST_FAILURE} from '../constants/Account'

export function loadAccountList() {
    return (dispatch) => {
        dispatch({
            type: GET_ACCOUNTIST_REQUEST,
            payload: true
        });

        fetch('/api/account')
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json) {
                dispatch({
                    type: GET_ACCOUNTLIST_SUCCESS,
                    payload: json.data
                })
            })
            .catch(function (response) {
                dispatch({
                    type: GET_ACCOUNTLIST_FAILURE,
                    payload: response.json
                })
            });
    }
}
