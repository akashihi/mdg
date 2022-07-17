export const GET_SETTING_SUCCESS = 'GET_SETTING_SUCCESS';

export enum SettingActionType {
    SettingsLoad = 'SettingsLoad',
    StoreSettings = 'StoreSettings',
    SettingsLoadFail = 'SettingsLoadFail',
    InitiateReindex = 'InitiateReindex',
    ReindexFail = 'ReindexFail',
}

export enum SettingUiState {
    Loading = 'Loading',
    Available = 'Available',
    Errored = 'Error',
}

export enum ReindexUiState {
    NotRequested = 'NotRequested',
    InProgress = 'InProgress',
    Complete = 'Complete',
    Failed = 'Failed',
}
