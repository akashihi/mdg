import jQuery from 'jquery';
import moment from 'moment';

import {checkApiError, parseJSON} from '../util/ApiUtils';

import {
  GET_TOTALSREPORT_REQUEST,
  GET_TOTALSREPORT_SUCCESS,
  GET_TOTALSREPORT_FAILURE,
  GET_SIMPLEASSETREPORT_REQUEST,
  GET_SIMPLEASSETREPORT_SUCCESS,
  GET_SIMPLEASSETREPORT_FAILURE
} from '../constants/Report'

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

export function loadSimpleAssetReport() {
  return (dispatch) => {
      dispatch({
          type: GET_SIMPLEASSETREPORT_REQUEST,
          payload: true
      });

      var params = {start: '2014-01-01', end: '2018-12-31', granularity: 30}
      var url = '/api/report/asset/simple' + '?' + jQuery.param(params)

      fetch(url)
          .then(parseJSON)
          .then(checkApiError)
          .then(function (json) {
              var series = json.data.attributes.value.map((item) => {
                  var dt = moment(item.date, 'YYYY-MM-DD')
                  return [dt.valueOf(), item.value]
              })
              dispatch({
                  type: GET_SIMPLEASSETREPORT_SUCCESS,
                  payload: series
              });
          })
          .catch(function (response) {
              dispatch({
                  type: GET_SIMPLEASSETREPORT_FAILURE,
                  payload: response.json
              })
          });
  }
}
