import {checkApiError, parseJSON} from '../util/ApiUtils';

import {GET_SETTING_REQUEST, GET_SETTING_SUCCESS, GET_SETTING_FAILURE} from '../constants/Setting'
import {loadAccountList} from './AccountViewerActions'

export function loadSettingList() {
    return (dispatch) => {
        dispatch({
            type: GET_SETTING_REQUEST,
            payload: true
        });

        fetch('/api/setting')
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json) {
                dispatch({
                    type: GET_SETTING_SUCCESS,
                    payload: json.data
                });
            })
            .catch(function (response) {
                dispatch({
                    type: GET_SETTING_FAILURE,
                    payload: response.json
                })
            });
    }
}

export function setPrimaryCurrency(currency_id) {
  return (dispatch) => {
      dispatch({
          type: GET_SETTING_REQUEST,
          payload: true
      });

      var url = '/api/setting/currency.primary';
      var method = 'PUT';
      var setting = { 'type': 'setting', 'id': 'currency.primary', 'attributes': {'value': currency_id.toString() }}

      fetch(url, {
          method: method,
          headers: {
              'Content-Type': 'application/vnd.mdg+json'
          },
          body: JSON.stringify({data: setting})
      })
          .then(parseJSON)
          .then(checkApiError)
          .then(()=>dispatch(loadSettingList()))
          .then(()=>dispatch(loadAccountList()))
          .catch(function (response) {
              dispatch({
                  type: GET_SETTING_FAILURE,
                  payload: response.json
              })
              dispatch(loadAccountList())
          })
  }
}