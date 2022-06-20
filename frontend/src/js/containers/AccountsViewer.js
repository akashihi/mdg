import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AccountsPage from '../components/account/AccountsPage'
import * as CurrencyActions from '../actions/CurrencyActions'
import * as AccountActions from '../actions/AccountActions'

const mapStateToProps = (state) => {
  return {
    currencies: state.get('currency').get('currencies'),
    categoryList: state.get('category').get('categoryList'),
    waiting: state.get('account').getIn(['ui', 'accountListLoading']),
    error: state.get('account').getIn(['ui', 'accountListError']),
    totals: state.get('account').get('totals'),
    hiddenVisible: state.get('account').getIn(['ui', 'hiddenAccountsVisible']),
    assetAccounts: state.get('account').get('assetAccountList'),
    incomeAccounts: state.get('account').get('incomeAccountList'),
    expenseAccounts: state.get('account').get('expenseAccountList'),
    primaryCurrency: state.get('setting').get('primaryCurrency')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    currencyActions: bindActionCreators(CurrencyActions, dispatch),
    actions: bindActionCreators(AccountActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountsPage)
