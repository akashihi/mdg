import {checkApiError, parseJSON, dataToMap} from '../util/ApiUtils';

import {GET_TAGLIST_REQUEST, GET_TAGLIST_SUCCESS, GET_TAGLIST_FAILURE} from '../constants/Tag'

export function loadTagList() {
    return (dispatch) => {
        dispatch({
            type: GET_TAGLIST_REQUEST,
            payload: true
        });

        fetch('/api/tag')
            .then(parseJSON)
            .then(checkApiError)
            .then(dataToMap)
            .then(function (map) {
                dispatch({
                    type: GET_TAGLIST_SUCCESS,
                    payload: map
                });
            })
            .catch(function () {
                dispatch({
                    type: GET_TAGLIST_FAILURE,
                    payload: []
                })
            });
    }
}
