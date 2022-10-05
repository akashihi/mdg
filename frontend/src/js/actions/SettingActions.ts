import { Action } from 'redux';

import { SettingActionType } from '../constants/Setting';
import { loadAccountList } from './AccountActions';
import { loadTotalsReport } from './ReportActions';

import * as API from '../api/api';
import * as Model from '../api/model';
import {Setting} from "../api/model";

export interface SettingApiObject {
    'currency.primary': string;
    'ui.transaction.closedialog': string;
    'ui.language': string;
}

export interface SettingAction extends Action {
    payload: Partial<SettingApiObject>;
}

function wrap(fn) {
    return function(dispatch) {
        fn(dispatch).catch(error => dispatch({ type: 'ERROR', error }));
    };
}

export function loadSettingList() {
    return wrap(async dispatch => {
        dispatch({ type: SettingActionType.SettingsLoad, payload: {} });
        const result = await API.listSettings();
        if (result.ok) {
            const parsedSettings = Object.fromEntries(result.val.map(item => [item.id, item.value]));
            dispatch({ type: SettingActionType.StoreSettings, payload: parsedSettings });
        } else {
            dispatch({ type: SettingActionType.SettingsLoadFail, payload: result.val });
        }
    });
}

function applySetting(id: Model.SettingKey, value: string) {
    return wrap(async dispatch => {
        dispatch({ type: SettingActionType.SettingsLoad, payload: {} });

        const setting = { id: id, value: value };
        const result = await API.saveSetting(setting);
        if (result.ok) {
            await dispatch(loadSettingList());
            await dispatch(loadAccountList());
            await dispatch(loadTotalsReport());
        } else {
            await dispatch(loadAccountList());
            dispatch({ type: SettingActionType.SettingsLoadFail, payload: result.val });
        }
    });
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
    return wrap(async dispatch => {
        dispatch({ type: SettingActionType.InitiateReindex, payload: {} });

        const setting: Setting = { id: "mnt.transaction.reindex", value: "true" };
        const result = await API.saveSetting(setting);
        if (result.ok) {
            await dispatch(loadSettingList());
        } else {
            await dispatch(loadAccountList());
            dispatch({ type: SettingActionType.ReindexFail, payload: result.val });
        }
    });
}
