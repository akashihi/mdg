import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import SettingsPage from '../components/SettingsPage'
import * as CurrencyActions from '../actions/CurrencyActions'
import * as SettingActions from '../actions/SettingActions'

const mapStateToProps = (state) => {
    return {
        primaryCurrency: state.setting.primaryCurrency,
        currencies: state.currency.currencyList,
    }
};

function mapDispatchToProps(dispatch) {
    return {
        currencyActions: bindActionCreators(CurrencyActions, dispatch),
        actions: bindActionCreators(SettingActions, dispatch)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage)
