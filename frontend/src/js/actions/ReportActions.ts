import { wrap } from './base';
import * as API from '../api/api';
import { TotalsReportLoad, TotalsReportStore } from '../reducers/ReportReducer';
import { NotifyError } from '../reducers/ErrorReducer';

export function loadTotalsReport() {
    return wrap(async dispatch => {
        dispatch(TotalsReportLoad());
        const result = await API.loadTotalsReport();
        if (result.ok) {
            dispatch(TotalsReportStore(result.val));
        } else {
            dispatch(NotifyError(result.val));
        }
    });
}
