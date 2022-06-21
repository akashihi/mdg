import { connect } from 'react-redux';

import { selectActiveCurrencies } from '../selectors/CurrencySelector'
import SettingsEditorWidget from '../components/settings/SettingEditorWidget';
import { setPrimaryCurrency,  setCloseTransactionDialog, setLanguage, reindexTransactions } from '../actions/SettingActions';

const mapStateToProps = (state) => {
  return {
    setting: state.get('setting'),
    activeCurrencies: selectActiveCurrencies(state)
  };
};

const mapDispatchToProps = { setPrimaryCurrency, setCloseTransactionDialog, setLanguage, reindexTransactions };

export default connect(mapStateToProps, mapDispatchToProps)(SettingsEditorWidget);
