import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TopBarWidget from '../components/TopBar'
import * as CurrencyActions from '../actions/CurrencyActions'
import * as SettingActions from '../actions/SettingActions'
import * as TagActions from '../actions/TagActions'
import * as BudgetActions from '../actions/BudgetViewerActions'

const mapStateToProps = (state) => {
    return {
        path: state.router.location.pathname
    }
};

function mapDispatchToProps(dispatch) {
    return {
        currencyActions: bindActionCreators(CurrencyActions, dispatch),
        settingActions: bindActionCreators(SettingActions, dispatch),
        tagActions: bindActionCreators(TagActions, dispatch),
        budgetActions: bindActionCreators(BudgetActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBarWidget)
