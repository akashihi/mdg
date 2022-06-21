export const GET_SETTING_SUCCESS = 'GET_SETTING_SUCCESS';

export enum SettingActionType {
    SettingsLoad = "SettingsLoad",
    StoreSettings = "StoreSettings",
    SettingsLoadFail = "SettingsLoadFail"
}

export enum SettingUiState {
    Loading = "Loading",
    Available = "Available",
    Errored = "Error"
}
