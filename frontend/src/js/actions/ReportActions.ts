import { Action } from 'redux';

import { ReportActionType } from '../constants/Report';
import { TotalsReport } from '../api/model';
import { wrap } from './base';
import * as API from '../api/api';

export interface ReportAction extends Action {
    payload: {
        totals: TotalsReport[];
    };
}
export function loadTotalsReport() {
    return wrap(async dispatch => {
        dispatch({ type: ReportActionType.TotalsReportLoad, payload: true });
        const result = await API.loadTotalsReport();
        if (result.ok) {
            dispatch({ type: ReportActionType.TotalsReportStore, payload: { totals: result.val } });
        }
    });
}
