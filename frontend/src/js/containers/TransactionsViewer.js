import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TransactionsPage from '../components/TransactionsPage'
import * as TransactionActions from '../actions/TransactionViewerActions'

const mapStateToProps = (state) => {
    return {
        currencies: state.currency.currencyList,
        waiting: state.transaction.ui.transactionListLoading,
        error: state.transaction.ui.transactionListError,
        assetAccounts: state.account.assetAccountList,
        incomeAccounts: state.account.incomeAccountList,
        expenseAccounts: state.account.expenseAccountList,
        transactions: state.transaction.transactionList,
        pageSize: state.transaction.ui.pageSize
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPage)
