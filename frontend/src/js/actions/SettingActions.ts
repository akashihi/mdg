import { loadAccountList } from './AccountActions';
import { loadTotalsReport } from './ReportActions';

import * as API from '../api/api';
import * as Model from '../api/model';
import { OverviewPanels, Setting } from '../api/model';
import { wrap } from './base';
import { InitiateReindex, ReindexFail, SettingsLoad, SettingsStore } from '../reducers/SettingReducer';
import { NotifyError } from '../reducers/ErrorReducer';
import { GetStateFunc } from '../reducers/rootReducer';
import { produce } from 'immer';

export function loadSettingList() {
    return wrap(async dispatch => {
        dispatch(SettingsLoad());
        const result = await API.listSettings();
        if (result.ok) {
            const parsedSettings = Object.fromEntries(result.val.map(item => [item.id, item.value]));
            dispatch(SettingsStore(parsedSettings));
        } else {
            dispatch(NotifyError(result.val));
        }
    });
}

function applySetting(id: Model.SettingKey, value: string) {
    return wrap(async dispatch => {
        dispatch(SettingsLoad());

        const setting = { id: id, value: value };
        const result = await API.saveSetting(setting);
        if (result.ok) {
            await dispatch(loadSettingList());
            await dispatch(loadAccountList());
            await dispatch(loadTotalsReport());
        } else {
            await dispatch(loadAccountList());
            dispatch(NotifyError(result.val));
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

export function setOverviewWidget(position: 'lt' | 'rt' | 'lb' | 'rb', widget: string) {
    return wrap(async (dispatch, getState: GetStateFunc) => {
        const newValue = produce(getState().setting.overview, draft => {
            draft[position] = widget as OverviewPanels;
        });
        dispatch(applySetting('ui.overviewpanel.widgets', JSON.stringify(newValue)));
    });
}

export function reindexTransactions() {
    return wrap(async dispatch => {
        dispatch(InitiateReindex());

        const setting: Setting = { id: 'mnt.transaction.reindex', value: 'true' };
        const result = await API.saveSetting(setting);
        if (result.ok) {
            await dispatch(loadSettingList());
        } else {
            await dispatch(loadAccountList());
            dispatch(ReindexFail());
            dispatch(NotifyError(result.val));
        }
    });
}
