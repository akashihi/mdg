import { connect } from 'react-redux';

import { selectActiveCurrencies } from '../selectors/CurrencySelector'
import SettingsEditorWidget from '../components/settings/SettingEditorWidget';
import { setPrimaryCurrency,  setCloseTransactionDialog, setLanguage, reindexTransactions } from '../actions/SettingActions';
import {SettingState} from "../reducers/SettingReducer";
import Currency from "../models/Currency";
import {getSettings} from "../selectors/StateGetters";
import {RootState} from "../reducers/rootReducer";

export interface SettingsEditorState {
    setting: SettingState;
    activeCurrencies: Currency[]
}

const mapStateToProps = (state: RootState):SettingsEditorState => {
  return {
    setting: getSettings(state),
    activeCurrencies: selectActiveCurrencies(state)
  };
};

const mapDispatchToProps = { setPrimaryCurrency, setCloseTransactionDialog, setLanguage, reindexTransactions };

export type SettingsEditorProps = SettingsEditorState & typeof mapDispatchToProps

export default connect(mapStateToProps, mapDispatchToProps)(SettingsEditorWidget);
