import produce from "immer"
import {SettingActionType, SettingUiState} from "../constants/Setting";
import {SettingAction} from "../actions/SettingActions";

export interface SettingState {
    readonly primaryCurrency: number;
    readonly closeTransactionDialog: boolean;
    readonly language: string;
    readonly ui: SettingUiState;
}

const initialState:SettingState = {
  primaryCurrency: -1,
  closeTransactionDialog: true,
  language: 'en-US',
  ui: SettingUiState.Loading
}

export default function currencyReducer (state:SettingState = initialState, action:SettingAction) {
  switch (action.type) {
    case SettingActionType.SettingsLoad:
        return produce(state, draft => { draft.ui=SettingUiState.Loading});
    case SettingActionType.StoreSettings:
        return produce(state, draft => {
            draft.ui=SettingUiState.Available;
            draft.primaryCurrency = parseInt(action.payload["currency.primary"]);
            draft.closeTransactionDialog = action.payload["ui.transaction.closedialog"] === 'true';
            draft.language = action.payload["ui.language"];
        });
    case SettingActionType.SettingsLoadFail:
        return produce(state, draft => { draft.ui=SettingUiState.Errored});
    default:
      return state
  }
}
