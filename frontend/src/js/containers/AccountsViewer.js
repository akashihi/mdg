import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AccountsPage from '../components/AccountsPage'
import * as CurrencyActions from '../actions/CurrencyActions'
import * as AccountActions from '../actions/AccountActions'


const mapStateToProps = (state) => {  
    return {
        currencies: state.currency.get('currencies'),
        categoryList: state.category.get('categoryList'),
        waiting: state.account.getIn(['ui', 'accountListLoading']),
        error: state.account.getIn(['ui', 'accountListError']),
        totals: state.account.get('totals'),
        hiddenVisible: state.account.getIn(['ui', 'hiddenAccountsVisible']),
        assetAccounts: state.account.get('assetAccountList'),
        incomeAccounts: state.account.get('incomeAccountList'),
        expenseAccounts: state.account.get('expenseAccountList'),
        primaryCurrency: state.setting.get('primaryCurrency')
    }
};

function mapDispatchToProps(dispatch) {
    return {
        currencyActions: bindActionCreators(CurrencyActions, dispatch),
        actions: bindActionCreators(AccountActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountsPage)
