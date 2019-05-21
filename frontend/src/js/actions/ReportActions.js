import jQuery from 'jquery';
import moment from 'moment';

import {checkApiError, parseJSON, singleToMap} from '../util/ApiUtils';

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
  GET_TYPEASSETREPORT_FAILURE,
  GET_INCOMEEVENTACCOUNTREPORT_REQUEST,
  GET_INCOMEEVENTACCOUNTREPORT_SUCCESS,
  GET_INCOMEEVENTACCOUNTREPORT_FAILURE,
  GET_EXPENSEEVENTACCOUNTREPORT_REQUEST,
  GET_EXPENSEEVENTACCOUNTREPORT_SUCCESS,
  GET_EXPENSEEVENTACCOUNTREPORT_FAILURE,
  GET_INCOMEWEIGHTACCOUNTREPORT_REQUEST,
  GET_INCOMEWEIGHTACCOUNTREPORT_SUCCESS,
  GET_INCOMEWEIGHTACCOUNTREPORT_FAILURE,
  GET_EXPENSEWEIGHTACCOUNTREPORT_REQUEST,
  GET_EXPENSEWEIGHTACCOUNTREPORT_SUCCESS,
  GET_EXPENSEWEIGHTACCOUNTREPORT_FAILURE
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
            .then(singleToMap)
            .then(function (map) {
                dispatch({
                    type: GET_TOTALSREPORT_SUCCESS,
                    payload: map.get('totals').get('value')
                });
            })
            .catch(function (response) {
                dispatch({
                    type: GET_TOTALSREPORT_FAILURE,
                    payload: response
                })
            });
    }
}

function reportDatesToParams(getState) {
    const state = getState();

    const params = {start: state.report.get('startDate').format('YYYY-MM-DD'), end: state.report.get('endDate').format('YYYY-MM-DD'), granularity: state.report.get('granularity')};
    return '?' + jQuery.param(params);
}

export function loadTypeAssetReport() {
  return (dispatch, getState) => {
      dispatch({
          type: GET_TYPEASSETREPORT_REQUEST,
          payload: true
      });

      const url = '/api/report/asset/type' + reportDatesToParams(getState);

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

      const state = getState();

      const url = '/api/report/asset/currency' + reportDatesToParams(getState);

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

      const url = '/api/report/asset/simple' + reportDatesToParams(getState);

      fetch(url)
          .then(parseJSON)
          .then(checkApiError)
          .then(function (json) {
              const series = json.data.attributes.value.map((item) => {
                  const dt = moment(item.date, 'YYYY-MM-DD');
                  return [dt.valueOf(), item.value];
              });
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

export function loadIncomeEventAccountReport() {
  return (dispatch, getState) => {
      dispatch({
          type: GET_INCOMEEVENTACCOUNTREPORT_REQUEST,
          payload: true
      });

      const state = getState();
      const url = '/api/report/income/events' + reportDatesToParams(getState);

      fetch(url)
          .then(parseJSON)
          .then(checkApiError)
          .then(function (json) {
            var report = json.data.attributes.value
            var dates = report.map((item) => moment(item.date, 'YYYY-MM-DD'))
            var series = {}
            report.forEach((dtEntry) => {
              dtEntry.entries.forEach((item) => {
                var accountObject = state.account.incomeAccountList.find((account) => account.id == item.account_id)
                if (accountObject) {
                  var account = accountObject.attributes.name
                } else {
                  account = item.account_id
                }
                if (!(account in series)) {
                  series[account] = []
                }
              })
            })
            report.forEach((dtEntry) => {
              var visited = []
              dtEntry.entries.forEach((item) => {
                var accountObject = state.account.incomeAccountList.find((account) => account.id == item.account_id)
                if (accountObject) {
                  var account = accountObject.attributes.name
                } else {
                  account = item.account_id
                }
                series[account].push(item.value)
                visited.push(account)
              })
              // Stuff skipped values
              for (var type in series) {
                if (!visited.find((item) => item==type)) {
                  series[type].push(0)
                }
              }
            })
            dispatch({
                  type: GET_INCOMEEVENTACCOUNTREPORT_SUCCESS,
                  payload: {
                    dates: dates,
                    series: series
                  }
              });
          })
          .catch(function (response) {
              dispatch({
                  type: GET_INCOMEEVENTACCOUNTREPORT_FAILURE,
                  payload: response.json
              })
          });
  }
}

export function loadExpenseEventAccountReport() {
  return (dispatch, getState) => {
      dispatch({
          type: GET_EXPENSEEVENTACCOUNTREPORT_REQUEST,
          payload: true
      });

      const state = getState();
      const url = '/api/report/expense/events' + reportDatesToParams(getState);

      fetch(url)
          .then(parseJSON)
          .then(checkApiError)
          .then(function (json) {
            var report = json.data.attributes.value
            var dates = report.map((item) => moment(item.date, 'YYYY-MM-DD'))
            var series = {}
            report.forEach((dtEntry) => {
              dtEntry.entries.forEach((item) => {
                var accountObject = state.account.expenseAccountList.find((account) => account.id == item.account_id)
                if (accountObject) {
                  var account = accountObject.attributes.name
                } else {
                  account = item.account_id
                }
                if (!(account in series)) {
                  series[account] = []
                }
              })
            })
            report.forEach((dtEntry) => {
              var visited = []
              dtEntry.entries.forEach((item) => {
                var accountObject = state.account.expenseAccountList.find((account) => account.id == item.account_id)
                if (accountObject) {
                  var account = accountObject.attributes.name
                } else {
                  account = item.account_id
                }
                series[account].push(item.value)
                visited.push(account)
              })
              // Stuff skipped values
              for (var type in series) {
                if (!visited.find((item) => item==type)) {
                  series[type].push(0)
                }
              }
            })
            dispatch({
                  type: GET_EXPENSEEVENTACCOUNTREPORT_SUCCESS,
                  payload: {
                    dates: dates,
                    series: series
                  }
              });
          })
          .catch(function (response) {
              dispatch({
                  type: GET_EXPENSEEVENTACCOUNTREPORT_FAILURE,
                  payload: response.json
              })
          });
  }
}

export function loadIncomeWeightAccountReport() {
  return (dispatch, getState) => {
      dispatch({
          type: GET_INCOMEWEIGHTACCOUNTREPORT_REQUEST,
          payload: true
      });

      const state = getState();
      const url = '/api/report/income/accounts' + reportDatesToParams(getState);

      fetch(url)
          .then(parseJSON)
          .then(checkApiError)
          .then(function (json) {
            var report = json.data.attributes.value
            var date = moment(report[0].date, 'YYYY-MM-DD')
            var series = []
            report[0].entries.forEach((item) => {
              var accountObject = state.account.incomeAccountList.find((account) => account.id == item.account_id)
              if (accountObject) {
                var account = accountObject.attributes.name
              } else {
                account = item.account_id
              }
              series.push({
                name: account,
                y: item.value
              })
            })
            dispatch({
                  type: GET_INCOMEWEIGHTACCOUNTREPORT_SUCCESS,
                  payload: {
                    date: date,
                    series: series
                  }
              });
          })
          .catch(function (response) {
              dispatch({
                  type: GET_INCOMEWEIGHTACCOUNTREPORT_FAILURE,
                  payload: response.json
              })
          });
  }
}

export function loadExpenseWeightAccountReport() {
  return (dispatch, getState) => {
      dispatch({
          type: GET_EXPENSEWEIGHTACCOUNTREPORT_REQUEST,
          payload: true
      });

      const state = getState();
      const url = '/api/report/expense/accounts' + reportDatesToParams(getState);

      fetch(url)
          .then(parseJSON)
          .then(checkApiError)
          .then(function (json) {
            var report = json.data.attributes.value
            var date = moment(report[0].date, 'YYYY-MM-DD')
            var series = []
            report[0].entries.forEach((item) => {
              var accountObject = state.account.expenseAccountList.find((account) => account.id == item.account_id)
              if (accountObject) {
                var account = accountObject.attributes.name
              } else {
                account = item.account_id
              }
              series.push({
                name: account,
                y: item.value
              })
            })
            dispatch({
                  type: GET_EXPENSEWEIGHTACCOUNTREPORT_SUCCESS,
                  payload: {
                    date: date,
                    series: series
                  }
              });
          })
          .catch(function (response) {
              dispatch({
                  type: GET_EXPENSEWEIGHTACCOUNTREPORT_FAILURE,
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
    dispatch(loadSimpleAssetReport());
    dispatch(loadIncomeEventAccountReport());
    dispatch(loadExpenseEventAccountReport());
    dispatch(loadIncomeWeightAccountReport());
    dispatch(loadExpenseWeightAccountReport())
  }
}

export function setReportStartDate(startDate) {
  return (dispatch) => {
    dispatch({
      type: SET_REPORT_STARTDATE,
      payload: moment(startDate)
    });
    dispatch(loadTypeAssetReport());
    dispatch(loadCurrencyAssetReport());
    dispatch(loadSimpleAssetReport());
    dispatch(loadIncomeEventAccountReport());
    dispatch(loadExpenseEventAccountReport());
    dispatch(loadIncomeWeightAccountReport());
    dispatch(loadExpenseWeightAccountReport())
  }
}

export function setReportEndDate(endDate) {
  return (dispatch) => {
    dispatch({
      type: SET_REPORT_ENDDATE,
      payload: moment(endDate)
    });
    dispatch(loadTypeAssetReport());
    dispatch(loadCurrencyAssetReport());
    dispatch(loadSimpleAssetReport());
    dispatch(loadIncomeEventAccountReport());
    dispatch(loadExpenseEventAccountReport());
    dispatch(loadIncomeWeightAccountReport());
    dispatch(loadExpenseWeightAccountReport())
  }
}
