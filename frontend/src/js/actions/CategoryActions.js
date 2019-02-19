import {checkApiError, parseJSON} from '../util/ApiUtils';
import {loadAccountList} from './AccountViewerActions';

import {
    GET_CATEGORYLIST_REQUEST,
    GET_CATEGORYLIST_SUCCESS,
    GET_CATEGORYLIST_FAILURE
} from '../constants/Category'

export function loadCategoryList() {
    return (dispatch) => {
        dispatch({
            type: GET_CATEGORYLIST_REQUEST,
            payload: true
        });

        var url = '/api/category';

        fetch(url)
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json) {
                dispatch({
                    type: GET_CATEGORYLIST_SUCCESS,
                    payload: json.data
                })
            })
            .then(() => dispatch(loadAccountList()))
            .catch(function (response) {
                dispatch({
                    type: GET_CATEGORYLIST_FAILURE,
                    payload: response.json
                })
            });
    }
}
