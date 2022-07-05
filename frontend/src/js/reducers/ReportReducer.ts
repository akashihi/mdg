import {produce} from 'immer';

import { ReportActionType } from '../constants/Report'
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

export default function reportReducer (state: ReportState = initialState, action: ReportAction) {
  switch (action.type) {
    case ReportActionType.TotalsReportLoad:
        return produce(state, draft => {draft.totalsAvailable = false});
    case ReportActionType.TotalsReportStore:
        return produce(state, draft => {draft.totalsAvailable = true; draft.totals = action.payload.totals});
    default:
      return state
  }
}
