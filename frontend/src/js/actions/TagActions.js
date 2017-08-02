import {checkApiError, parseJSON} from '../util/ApiUtils';

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
            .then(function (json) {
                dispatch({
                    type: GET_TAGLIST_SUCCESS,
                    payload: json.data
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
