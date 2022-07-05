import {produce} from 'immer';

import {
    GET_BUDGETREPORT_REQUEST,
    GET_BUDGETREPORT_SUCCESS,
    GET_BUDGETREPORT_FAILURE, ReportActionType
} from '../constants/Report'
import {TotalsReport} from "../models/Report";
import {ReportAction} from "../actions/ReportActions";

export interface ReportState {
    totals: TotalsReport[];
    totalsAvailable: boolean;
}

const initialState: ReportState = {
    totals: [],
    totalsAvailable: false
}

/*const initialState = Map({
  budgetExecutionReport: Map({ dates: List(), aIncome: List(), eIncome: List(), aExpense: List(), eExpense: List(), profit: List() }),

})*/

export default function reportReducer (state: ReportState = initialState, action: ReportAction) {
  switch (action.type) {
    case ReportActionType.TotalsReportLoad:
        return produce(state, draft => {draft.totalsAvailable = false});
    case ReportActionType.TotalsReportStore:
        return produce(state, draft => {draft.totalsAvailable = true; draft.totals = action.payload.totals});
    /*
    case GET_BUDGETREPORT_REQUEST:
    case GET_BUDGETREPORT_FAILURE:
      return state.set('budgetExecutionReport', Map({ dates: List(), aIncome: List(), eIncome: List(), aExpense: List(), eExpense: List(), profit: List() }))
    case GET_BUDGETREPORT_SUCCESS:
      return state.set('budgetExecutionReport', action.payload)*/
    default:
      return state
  }
}
