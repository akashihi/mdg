import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AccountsPage from '../components/AccountsPage'
import * as CurrencyActions from '../actions/CurrencyActions'
import * as AccountActions from '../actions/AccountViewerActions'


const mapStateToProps = (state) => {
    return {
        currencies: state.currency.currencyList,
        waiting: state.account.ui.accountListLoading,
        error: state.account.ui.accountListError,
        totals: state.account.totals,
        hiddenVisible: state.account.ui.hiddenAccountsVisible,
        assetAccounts: state.account.assetAccountList,
        incomeAccounts: state.account.incomeAccountList,
        expenseAccounts: state.account.expenseAccountList,
        primaryCurrency: state.setting.primaryCurrency
    }
};

function mapDispatchToProps(dispatch) {
    return {
        currencyActions: bindActionCreators(CurrencyActions, dispatch),
        actions: bindActionCreators(AccountActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountsPage)
