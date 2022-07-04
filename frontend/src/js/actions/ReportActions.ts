import { Action } from 'redux';
import moment from 'moment'
import Immutable, { List, Map, OrderedMap } from 'immutable'

import { checkApiError, parseJSON } from '../util/ApiUtils'

import {
    GET_BUDGETREPORT_REQUEST,
    GET_BUDGETREPORT_SUCCESS,
    GET_BUDGETREPORT_FAILURE,
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
    GET_EXPENSEWEIGHTACCOUNTREPORT_FAILURE, ReportActionType
} from '../constants/Report'
import {TotalsReport} from "../models/Report";

export interface ReportAction extends Action {
    payload: {
        totals: TotalsReport[]
    }
}
export function loadTotalsReport () {
  return (dispatch) => {
    dispatch({type: ReportActionType.TotalsReportLoad,
      payload: true
    })

    fetch('/api/reports/totals')
      .then(parseJSON)
      .then(checkApiError)
      .then(function (map:any) {
        dispatch({type: ReportActionType.TotalsReportStore, payload: {totals: map.report}})
      })
  }
}

export function loadBudgetExecutionReport () {
  /*return (dispatch, getState) => {
    dispatch({
      type: GET_BUDGETREPORT_REQUEST,
      payload: true
    })

    const url = '/api/report/budget/execution' + reportDatesToParams(getState)

    fetch(url)
      .then(parseJSON)
      .then(checkApiError)
      .then(function (json) {
        const dates = Immutable.fromJS(json.data.attributes.value.map(item => item.date))
        const aIncome = Immutable.fromJS(json.data.attributes.value.map(item => item.income.actual))
        const eIncome = Immutable.fromJS(json.data.attributes.value.map(item => item.income.expected))
        const aExpense = Immutable.fromJS(json.data.attributes.value.map(item => -1 * item.expense.actual))
        const eExpense = Immutable.fromJS(json.data.attributes.value.map(item => -1 * item.expense.expected))
        const profit = Immutable.fromJS(json.data.attributes.value.map(item => item.profit))
        dispatch({
          type: GET_BUDGETREPORT_SUCCESS,
          payload: Map({ dates, aIncome, eIncome, aExpense, eExpense, profit })
        })
      })
      .catch(function (response) {
        dispatch({
          type: GET_BUDGETREPORT_FAILURE,
          payload: response.json
        })
      })
  }*/
}

function processIdentifiedInTimeReport (json, idMapping) {
  /*const report = Immutable.fromJS(json)
  const dates = report.map((item) => moment(item.get('date'), 'YYYY-MM-DD'))

  const currencyReport = report.map(idMapping)

  let idsMap = OrderedMap()
  let emptyMap = OrderedMap()
  currencyReport.forEach(item => {
    idsMap = idsMap.set(item.get('id'), 0)
    emptyMap = emptyMap.set(item.get('id'), List())
  })

  let datedSeries = OrderedMap()
  currencyReport.forEach(item => {
    const dt = item.get('date')
    if (!datedSeries.has(dt)) {
      datedSeries = datedSeries.set(dt, idsMap)
    }
    datedSeries = datedSeries.update(dt, entry => entry.set(item.get('id'), item.get('value')))
  })

  let series = OrderedMap(emptyMap)
  datedSeries.valueSeq().forEach(item => {
    item.forEach((v, k) => {
      series = series.update(k, list => list.push(v))
    })
  })

  return Map({
    dates,
    series
  })*/
}

export function loadTypeAssetReport () {
  /*return (dispatch, getState) => {
    dispatch({
      type: GET_TYPEASSETREPORT_REQUEST,
      payload: true
    })

    const state = getState()

    const url = '/api/report/asset/type' + reportDatesToParams(getState)

    fetch(url)
      .then(parseJSON)
      .then(checkApiError)
      .then(function (json) {
        const categoryMapper = item => {
          if (state.get('category').get('categoryList').has(parseInt(item.get('id')))) {
            return item.set('id', state.get('category').get('categoryList').get(parseInt(item.get('id'))).get('name'))
          }
          return item
        }

        const result = processIdentifiedInTimeReport(json.data.attributes.value, categoryMapper)

        dispatch({
          type: GET_TYPEASSETREPORT_SUCCESS,
          payload: result
        })
      })
      .catch(function (response) {
        dispatch({
          type: GET_TYPEASSETREPORT_FAILURE,
          payload: response.json
        })
      })
  }*/
}

export function loadCurrencyAssetReport () {
  /*return (dispatch, getState) => {
    dispatch({
      type: GET_CURRENCYASSETREPORT_REQUEST,
      payload: true
    })

    const state = getState()

    const url = '/api/report/asset/currency' + reportDatesToParams(getState)

    fetch(url)
      .then(parseJSON)
      .then(checkApiError)
      .then(function (json) {
        const currencyMapper = item => {
          if (state.get('currency').get('currencies').has(parseInt(item.get('id')))) {
            return item.set('id', state.get('currency').get('currencies').get(parseInt(item.get('id'))).get('name'))
          }
          return item
        }

        const result = processIdentifiedInTimeReport(json.data.attributes.value, currencyMapper)

        dispatch({
          type: GET_CURRENCYASSETREPORT_SUCCESS,
          payload: result
        })
      })
      .catch(function (response) {
        dispatch({
          type: GET_CURRENCYASSETREPORT_FAILURE,
          payload: response.json
        })
      })
  }*/
}

function getAccountMapper (state) {
  /*return item => {
    if (state.get('account').get('accountList').has(parseInt(item.get('id')))) {
      return item.set('id', state.get('account').get('accountList').get(parseInt(item.get('id'))).get('name'))
    }
    return item
  }*/
}

export function loadIncomeEventAccountReport () {
  /*return (dispatch, getState) => {
    dispatch({
      type: GET_INCOMEEVENTACCOUNTREPORT_REQUEST,
      payload: true
    })

    const state = getState()
    const url = '/api/report/income/events' + reportDatesToParams(getState)

    fetch(url)
      .then(parseJSON)
      .then(checkApiError)
      .then(function (json) {
        const result = processIdentifiedInTimeReport(json.data.attributes.value, getAccountMapper(state))

        dispatch({
          type: GET_INCOMEEVENTACCOUNTREPORT_SUCCESS,
          payload: result
        })
      })
      .catch(function (response) {
        dispatch({
          type: GET_INCOMEEVENTACCOUNTREPORT_FAILURE,
          payload: response.json
        })
      })
  }*/
}

export function loadExpenseEventAccountReport () {
  /*return (dispatch, getState) => {
    dispatch({
      type: GET_EXPENSEEVENTACCOUNTREPORT_REQUEST,
      payload: true
    })

    const state = getState()
    const url = '/api/report/expense/events' + reportDatesToParams(getState)

    fetch(url)
      .then(parseJSON)
      .then(checkApiError)
      .then(function (json) {
        const result = processIdentifiedInTimeReport(json.data.attributes.value, getAccountMapper(state))

        dispatch({
          type: GET_EXPENSEEVENTACCOUNTREPORT_SUCCESS,
          payload: result
        })
      })
      .catch(function (response) {
        dispatch({
          type: GET_EXPENSEEVENTACCOUNTREPORT_FAILURE,
          payload: response.json
        })
      })
  }*/
}

function processWeightAccountReport (json, state) {
  /*const report = Immutable.fromJS(json)
  const date = moment(report.first().get('date'), 'YYYY-MM-DD')
  const accountReport = report.map(getAccountMapper(state))

  let series = List()
  accountReport.forEach(item => {
    series = series.push({ name: item.get('id'), y: item.get('value') })
  })

  return Map({
    date,
    series
  })*/
}

export function loadIncomeWeightAccountReport () {
  /*return (dispatch, getState) => {
    dispatch({
      type: GET_INCOMEWEIGHTACCOUNTREPORT_REQUEST,
      payload: true
    })

    const state = getState()
    const url = '/api/report/income/accounts' + reportDatesToParams(getState)

    fetch(url)
      .then(parseJSON)
      .then(checkApiError)
      .then(function (json) {
        const result = processWeightAccountReport(json.data.attributes.value, state)

        dispatch({
          type: GET_INCOMEWEIGHTACCOUNTREPORT_SUCCESS,
          payload: result
        })
      })
      .catch(function (response) {
        dispatch({
          type: GET_INCOMEWEIGHTACCOUNTREPORT_FAILURE,
          payload: response.json
        })
      })
  }*/
}

export function loadExpenseWeightAccountReport () {
  /*return (dispatch, getState) => {
    dispatch({
      type: GET_EXPENSEWEIGHTACCOUNTREPORT_REQUEST,
      payload: true
    })

    const state = getState()
    const url = '/api/report/expense/accounts' + reportDatesToParams(getState)

    fetch(url)
      .then(parseJSON)
      .then(checkApiError)
      .then(function (json) {
        const result = processWeightAccountReport(json.data.attributes.value, state)
        dispatch({
          type: GET_EXPENSEWEIGHTACCOUNTREPORT_SUCCESS,
          payload: result
        })
      })
      .catch(function (response) {
        dispatch({
          type: GET_EXPENSEWEIGHTACCOUNTREPORT_FAILURE,
          payload: response.json
        })
      })
  }*/
}
