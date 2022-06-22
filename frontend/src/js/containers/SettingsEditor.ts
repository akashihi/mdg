import { connect } from 'react-redux';

import { selectActiveCurrencies } from '../selectors/CurrencySelector'
import SettingsEditorWidget from '../components/settings/SettingEditorWidget';
import { setPrimaryCurrency,  setCloseTransactionDialog, setLanguage, reindexTransactions } from '../actions/SettingActions';
import {SettingState} from "../reducers/SettingReducer";
import Currency from "../models/Currency";

export interface SettingsEditorState {
    setting: SettingState;
    activeCurrencies: Currency[]
}

const mapStateToProps = (state):SettingsEditorState => {
  return {
    setting: state.get('setting'),
    activeCurrencies: selectActiveCurrencies(state)
  };
};

const mapDispatchToProps = { setPrimaryCurrency, setCloseTransactionDialog, setLanguage, reindexTransactions };

export type SettingsEditorProps = SettingsEditorState & typeof mapDispatchToProps

export default connect(mapStateToProps, mapDispatchToProps)(SettingsEditorWidget);
