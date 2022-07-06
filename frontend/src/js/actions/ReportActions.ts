import { Action } from 'redux';

import { checkApiError, parseJSON } from '../util/ApiUtils'

import { ReportActionType } from '../constants/Report'
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
