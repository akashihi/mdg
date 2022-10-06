import { Action } from 'redux';
import moment from 'moment';
import * as API from '../api/api';
import * as Model from '../api/model';
import { RateActionsType } from '../constants/Rate';
import {wrap} from "./base";

export interface RateAction extends Action {
    payload: Model.Rate[];
}

export function loadRatesList() {
    return wrap(async dispatch => {
        dispatch({ type: RateActionsType.RatesLoad, payload: {} });
        const now = moment();
        const result = await API.listRates(now);
        if (result.ok) {
            dispatch({ type: RateActionsType.RatesStore, payload: result.val });
        } else {
            dispatch({ type: RateActionsType.RatesStore, payload: {} });
        }
    });
}
