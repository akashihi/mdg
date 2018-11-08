import {checkApiError, parseJSON} from '../util/ApiUtils';

import {GET_TOTALSREPORT_REQUEST, GET_TOTALSREPORT_SUCCESS, GET_TOTALSREPORT_FAILURE} from '../constants/Report'

export function loadTotalsReport() {
    return (dispatch) => {
        dispatch({
            type: GET_TOTALSREPORT_REQUEST,
            payload: true
        });

        fetch('/api/report/totals')
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json) {
                dispatch({
                    type: GET_TOTALSREPORT_SUCCESS,
                    payload: json.data.attributes.value
                });
            })
            .catch(function (response) {
                dispatch({
                    type: GET_TOTALSREPORT_FAILURE,
                    payload: response.json
                })
            });
    }
}
