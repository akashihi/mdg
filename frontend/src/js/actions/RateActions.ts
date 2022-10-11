import moment from 'moment';
import * as API from '../api/api';
import { wrap } from './base';
import {RatesLoad, RatesStore} from '../reducers/RateReducer';
import {NotifyError} from "../reducers/ErrorReducer";

export function loadRatesList() {
    return wrap(async dispatch => {
        dispatch(RatesLoad());
        const now = moment();
        const result = await API.listRates(now);
        if (result.ok) {
            dispatch(RatesStore(result.val));
        } else {
            dispatch(RatesStore([]));
            dispatch(NotifyError(result.val));
        }
    });
}
