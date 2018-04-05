import moment from 'moment';
import {checkApiError, parseJSON} from '../util/ApiUtils';

import {GET_RATELIST_REQUEST, GET_RATELIST_SUCCESS, GET_RATELIST_FAILURE} from '../constants/Rate'

export function loadRatesList() {
    return (dispatch) => {
        dispatch({
            type: GET_RATELIST_REQUEST,
            payload: true
        });

        var now = moment().format('YYYY-MM-DDTHH:mm:ss');

        fetch('/api/rate/' + now)
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json) {
                dispatch({
                    type: GET_RATELIST_SUCCESS,
                    payload: json.data
                });
            })
            .catch(function (response) {
                dispatch({
                    type: GET_RATELIST_FAILURE,
                    payload: response.json
                })
            });
    }
}
