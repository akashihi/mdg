import { TotalsReport } from '../api/models/Report';
import {createAction, createReducer} from "@reduxjs/toolkit";

export const TotalsReportLoad = createAction('TotalsReportLoad');
export const TotalsReportStore = createAction<TotalsReport[]>('TotalsReportStore');

export interface ReportState {
    totals: TotalsReport[];
    totalsAvailable: boolean;
}

const initialState: ReportState = {
    totals: [],
    totalsAvailable: false,
};

export default createReducer(initialState, builder => {
    builder
        .addCase(TotalsReportLoad, (state) => {
            state.totalsAvailable = false;
        })
        .addCase(TotalsReportStore, (state, action) => {
            state.totalsAvailable = true;
            state.totals = action.payload;
        })
})
