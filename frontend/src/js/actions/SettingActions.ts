import { Action } from 'redux';

import { processApiResponse } from '../util/ApiUtils';

import { SettingActionType } from '../constants/Setting';
import { loadAccountList } from './AccountActions';
import { loadTotalsReport } from './ReportActions';

export interface SettingApiObject {
    'currency.primary': string;
    'ui.transaction.closedialog': string;
    'ui.language': string;
}

export interface SettingAction extends Action {
    payload: Partial<SettingApiObject>;
}

export function loadSettingList() {
    return dispatch => {
        dispatch({ type: SettingActionType.SettingsLoad, payload: {} });

        fetch('/api/settings')
            .then(processApiResponse)
            .then(function (data) {
                const map = Object.fromEntries(data.settings.map(item => [item.id, item.value]));
                dispatch({ type: SettingActionType.StoreSettings, payload: map });
            })
            .catch(function () {
                dispatch({ type: SettingActionType.SettingsLoadFail, payload: {} });
            });
    };
}

function applySetting(id: string, value: string) {
    return dispatch => {
        dispatch({ type: SettingActionType.SettingsLoad, payload: {} });

        const url = `/api/settings/${id}`;
        const method = 'PUT';
        const setting = { id: id, value: value };

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/vnd.mdg+json;version=1',
            },
            body: JSON.stringify(setting),
        })
            .then(processApiResponse)
            .then(() => dispatch(loadSettingList()))
            .then(() => dispatch(loadAccountList()))
            .then(() => dispatch(loadTotalsReport()))
            .catch(function () {
                dispatch({
                    type: SettingActionType.SettingsLoadFail,
                    payload: {},
                });
                dispatch(loadAccountList());
            });
    };
}

export function setPrimaryCurrency(currencyId: number) {
    return applySetting('currency.primary', currencyId.toString());
}

export function setCloseTransactionDialog(value: boolean) {
    return applySetting('ui.transaction.closedialog', value.toString());
}

export function setLanguage(locale: string) {
    return applySetting('ui.language', locale);
}

export function reindexTransactions() {
    return dispatch => {
        dispatch({ type: SettingActionType.InitiateReindex, payload: {} });

        const url = '/api/settings/mnt.transaction.reindex';
        const method = 'PUT';

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/vnd.mdg+json;version=1',
            },
        })
            .then(processApiResponse)
            .then(() => dispatch(loadSettingList()))
            .catch(function () {
                dispatch({
                    type: SettingActionType.ReindexFail,
                    payload: {},
                });
            });
    };
}
