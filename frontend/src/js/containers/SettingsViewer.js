import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import SettingsPage from '../components/SettingsPage'
import * as CurrencyActions from '../actions/CurrencyActions'
import * as SettingActions from '../actions/SettingActions'

const mapStateToProps = (state) => {
    return {
        primaryCurrency: state.setting.get('primaryCurrency'),
        closeTransactionDialog: state.setting.get('closeTransactionDialog'),
        setting: state.setting,
        currency: state.currency,
    }
};

function mapDispatchToProps(dispatch) {
    return {
        currencyActions: bindActionCreators(CurrencyActions, dispatch),
        actions: bindActionCreators(SettingActions, dispatch)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage)
