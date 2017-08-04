import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AccountsOverviewPanel from '../components/AccountsOverviewPanel'
import * as AccountActions from '../actions/AccountViewerActions'


const mapStateToProps = (state) => {
    return {
        currencies: state.currency.currencyList,
        assetAccounts: state.account.assetAccountList,
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AccountActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountsOverviewPanel)
