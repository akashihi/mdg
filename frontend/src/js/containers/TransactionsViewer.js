import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TransactionsPage from '../components/TransactionsPage'
import * as TransactionActions from '../actions/TransactionActions'
import * as TagActions from '../actions/TagActions'

const mapStateToProps = (state) => {
    return {
        waiting: state.transaction.ui.transactionListLoading,
        error: state.transaction.ui.transactionListError,
        assetAccounts: state.account.get('assetAccountList'),
        incomeAccounts: state.account.get('incomeAccountList'),
        expenseAccounts: state.account.get('expenseAccountList'),
        accounts: state.account.get('accountList'),
        transactions: state.transaction.transactionList,
        periodBeginning: state.transactionview.periodBeginning,
        periodEnd: state.transactionview.periodEnd
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionActions, dispatch),
        tagActions: bindActionCreators(TagActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPage)
