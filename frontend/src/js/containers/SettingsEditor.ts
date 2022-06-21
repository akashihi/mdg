import { connect } from 'react-redux';

import SettingsEditorWidget from '../components/settings/SettingEditorWidget';
import { setPrimaryCurrency,  setCloseTransactionDialog, setLanguage, reindexTransactions } from '../actions/SettingActions';

const mapStateToProps = (state) => {
  return {
    setting: state.get('setting'),
    currency: state.get('currency')
  };
};

const mapDispatchToProps = { setPrimaryCurrency, setCloseTransactionDialog, setLanguage, reindexTransactions };

export default connect(mapStateToProps, mapDispatchToProps)(SettingsEditorWidget);
