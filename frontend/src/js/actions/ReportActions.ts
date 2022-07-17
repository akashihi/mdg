import { Action } from 'redux';

import { processApiResponse } from '../util/ApiUtils';

import { ReportActionType } from '../constants/Report';
import { TotalsReport } from '../models/Report';

export interface ReportAction extends Action {
    payload: {
        totals: TotalsReport[];
    };
}
export function loadTotalsReport() {
    return dispatch => {
        dispatch({ type: ReportActionType.TotalsReportLoad, payload: true });

        fetch('/api/reports/totals')
            .then(processApiResponse)
            .then(function (map) {
                dispatch({ type: ReportActionType.TotalsReportStore, payload: { totals: map.report } });
            });
    };
}
