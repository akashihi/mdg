import { Action } from 'redux';

import { checkApiError, parseJSON } from '../util/ApiUtils'

import {
    GET_BUDGETREPORT_REQUEST,
    GET_BUDGETREPORT_SUCCESS,
    GET_BUDGETREPORT_FAILURE,
    ReportActionType
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
