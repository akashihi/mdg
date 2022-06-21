import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import SettingsPage from '../components/SettingsPage'
import * as CurrencyActions from '../actions/CurrencyActions'
import * as SettingActions from '../actions/SettingActions'

const mapStateToProps = (state) => {
  return {
    primaryCurrency: state.get('setting').primaryCurrency,
    closeTransactionDialog: state.get('setting').closeTransactionDialog,
    language: state.get('setting').language,
    setting: state.get('setting'),
    currency: state.get('currency')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    currencyActions: bindActionCreators(CurrencyActions, dispatch),
    actions: bindActionCreators(SettingActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage)
