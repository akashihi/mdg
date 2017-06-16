import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TransactionsPage from '../components/TransactionsPage'
import * as TransactionActions from '../actions/TransactionViewerActions'
import * as TagActions from '../actions/TagActions'

const mapStateToProps = (state) => {
    return {
        currencies: state.currency.currencyList,
        waiting: state.transaction.ui.transactionListLoading,
        error: state.transaction.ui.transactionListError,
        assetAccounts: state.account.assetAccountList,
        incomeAccounts: state.account.incomeAccountList,
        expenseAccounts: state.account.expenseAccountList,
        transactions: state.transaction.transactionList,
        nextPageAvailable: state.transaction.ui.nextPageAvailable,
        periodBeginning: state.transaction.ui.periodBeginning,
        periodEnd: state.transaction.ui.periodEnd
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionActions, dispatch),
        tagActions: bindActionCreators(TagActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPage)
