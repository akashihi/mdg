import jQuery from 'jquery';
import moment from 'moment';

import {checkApiError, parseJSON} from '../util/ApiUtils';

import {
  GET_TOTALSREPORT_REQUEST,
  GET_TOTALSREPORT_SUCCESS,
  GET_TOTALSREPORT_FAILURE,
  GET_SIMPLEASSETREPORT_REQUEST,
  GET_SIMPLEASSETREPORT_SUCCESS,
  GET_SIMPLEASSETREPORT_FAILURE,
  SET_REPORT_STARTDATE,
  SET_REPORT_ENDDATE,
  SET_REPORT_GRANULARITY,
  GET_CURRENCYASSETREPORT_REQUEST,
  GET_CURRENCYASSETREPORT_SUCCESS,
  GET_CURRENCYASSETREPORT_FAILURE,
  GET_TYPEASSETREPORT_REQUEST,
  GET_TYPEASSETREPORT_SUCCESS,
  GET_TYPEASSETREPORT_FAILURE
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

export function loadTypeAssetReport() {
  return (dispatch, getState) => {
      dispatch({
          type: GET_TYPEASSETREPORT_REQUEST,
          payload: true
      });

      var state = getState()

      var params = {start: state.report.startDate.format('YYYY-MM-DD'), end: state.report.endDate.format('YYYY-MM-DD'), granularity: state.report.granularity}
      var url = '/api/report/asset/type' + '?' + jQuery.param(params)

      fetch(url)
          .then(parseJSON)
          .then(checkApiError)
          .then(function (json) {
            var report = json.data.attributes.value
            var dates = report.map((item) => moment(item.date, 'YYYY-MM-DD'))
            var series = {}
            report.forEach((dtEntry) => {
              dtEntry.entries.forEach((item) => {
                if (!(item.type in series)) {
                  series[item.type] = []
                }
              })
            })
            report.forEach((dtEntry) => {
              var visited = []
              dtEntry.entries.forEach((item) => {
                series[item.type].push(item.value)
                visited.push(item.type)
              })
              // Stuff skipped values
              for (var type in series) {
                if (!visited.find((item) => item==type)) {
                  series[type].push(0)
                }
              }
            })
              dispatch({
                  type: GET_TYPEASSETREPORT_SUCCESS,
                  payload: {
                    dates: dates,
                    series: series
                  }
              });
          })
          .catch(function (response) {
              dispatch({
                  type: GET_TYPEASSETREPORT_FAILURE,
                  payload: response.json
              })
          });
  }
}

export function loadCurrencyAssetReport() {
  return (dispatch, getState) => {
      dispatch({
          type: GET_CURRENCYASSETREPORT_REQUEST,
          payload: true
      });

      var state = getState()

      var params = {start: state.report.startDate.format('YYYY-MM-DD'), end: state.report.endDate.format('YYYY-MM-DD'), granularity: state.report.granularity}
      var url = '/api/report/asset/currency' + '?' + jQuery.param(params)

      fetch(url)
          .then(parseJSON)
          .then(checkApiError)
          .then(function (json) {
            var report = json.data.attributes.value
            var dates = report.map((item) => moment(item.date, 'YYYY-MM-DD'))
            var series = {}
            report.forEach((dtEntry) => {
              dtEntry.entries.forEach((item) => {
                var currencyObject = state.currency.currencyList.find((currency) => currency.id == item.currency)
                if (currencyObject) {
                  var currency = currencyObject.attributes.name
                } else {
                  currency = item.currency
                }
                if (!(currency in series)) {
                  series[currency] = []
                }
              })
            })
            report.forEach((dtEntry) => {
              var visited = []
              dtEntry.entries.forEach((item) => {
                var currencyObject = state.currency.currencyList.find((currency) => currency.id == item.currency)
                if (currencyObject) {
                  var currency = currencyObject.attributes.name
                } else {
                  currency = item.currency
                }
                series[currency].push(item.value)
                visited.push(currency)
              })
              // Stuff skipped values
              for (var type in series) {
                if (!visited.find((item) => item==type)) {
                  series[type].push(0)
                }
              }
            })
            dispatch({
                  type: GET_CURRENCYASSETREPORT_SUCCESS,
                  payload: {
                    dates: dates,
                    series: series
                  }
              });
          })
          .catch(function (response) {
              dispatch({
                  type: GET_CURRENCYASSETREPORT_FAILURE,
                  payload: response.json
              })
          });
  }
}

export function loadSimpleAssetReport() {
  return (dispatch, getState) => {
      dispatch({
          type: GET_SIMPLEASSETREPORT_REQUEST,
          payload: true
      });

      var state = getState()

      var params = {start: state.report.startDate.format('YYYY-MM-DD'), end: state.report.endDate.format('YYYY-MM-DD'), granularity: state.report.granularity}
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


export function setReportGranularity(granularity) {
  return (dispatch) => {
      dispatch({
        type: SET_REPORT_GRANULARITY,
        payload: granularity
    });
    dispatch(loadTypeAssetReport());
    dispatch(loadCurrencyAssetReport());
    dispatch(loadSimpleAssetReport())
  }
}

export function setReportStartDate(startDate) {
  return (dispatch) => {
    dispatch({
      type: SET_REPORT_STARTDATE,
      payload: moment(startDate)
    })
    dispatch(loadTypeAssetReport());
    dispatch(loadCurrencyAssetReport());
    dispatch(loadSimpleAssetReport())
  }
}

export function setReportEndDate(endDate) {
  return (dispatch) => {
    dispatch({
      type: SET_REPORT_ENDDATE,
      payload: moment(endDate)
    })
    dispatch(loadTypeAssetReport());
    dispatch(loadCurrencyAssetReport());
    dispatch(loadSimpleAssetReport())
  }
}
