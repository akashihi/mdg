import { createAction, createReducer } from '@reduxjs/toolkit';
import { OverviewSetting } from '../api/models/Setting';
import { overviewSettingParse } from '../api/Settings';

export const SettingsLoad = createAction('SettingsLoad');
export const SettingsStore = createAction<Record<string, string>>('SettingsStore');
export const InitiateReindex = createAction('InitiateReindex');
export const ReindexFail = createAction('ReindexFail');

export enum ReindexUiState {
    NotRequested = 'NotRequested',
    InProgress = 'InProgress',
    Complete = 'Complete',
    Failed = 'Failed',
}

export interface SettingState {
    readonly primaryCurrency: number;
    readonly closeTransactionDialog: boolean;
    readonly language: string;
    readonly available: boolean;
    readonly indexingUi: ReindexUiState;
    readonly overview: OverviewSetting;
}

const initialState: SettingState = {
    primaryCurrency: -1,
    closeTransactionDialog: true,
    language: 'en-US',
    available: false,
    indexingUi: ReindexUiState.NotRequested,
    overview: { lt: 'finance', rt: 'asset', lb: 'budget', rb: 'transactions' },
};

export default createReducer(initialState, builder => {
    builder
        .addCase(SettingsLoad, state => {
            state.available = false;
        })
        .addCase(SettingsStore, (state, action) => {
            state.available = true;
            state.primaryCurrency = parseInt(action.payload['currency.primary']);
            state.closeTransactionDialog = action.payload['ui.transaction.closedialog'] === 'true';
            state.language = action.payload['ui.language'];
            state.indexingUi =
                state.indexingUi == ReindexUiState.InProgress ? ReindexUiState.Complete : state.indexingUi;
            const overview = overviewSettingParse(action.payload['ui.overviewpanel.widgets']);
            if (overview) {
                state.overview = overview;
            }
        })
        .addCase(InitiateReindex, state => {
            state.indexingUi = ReindexUiState.InProgress;
        })
        .addCase(ReindexFail, state => {
            state.indexingUi = ReindexUiState.Failed;
        });
});
