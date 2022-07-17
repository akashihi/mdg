import { Action } from 'redux';
import moment from 'moment';
import { processApiResponse } from '../util/ApiUtils';

import { RateActionsType } from '../constants/Rate';
import Rate from '../models/Rate';

export interface RateAction extends Action {
    payload: Rate[];
}

export function loadRatesList() {
    return dispatch => {
        dispatch({ type: RateActionsType.RatesLoad, payload: {} });

        const now = moment().format('YYYY-MM-DDTHH:mm:ss');

        fetch(`/api/rates/${now}`)
            .then(processApiResponse)
            .then(function (json) {
                dispatch({
                    type: RateActionsType.RatesStore,
                    payload: json.rates,
                });
            })
            .catch(function () {
                dispatch({ type: RateActionsType.RatesStore, payload: {} }); // Silently ignore issues, rates are not important.
            });
    };
}
