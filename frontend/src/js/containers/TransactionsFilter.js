import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TransactionsPageFilter from '../components/TransactionsPageFilter'
import * as TransactionActions from '../actions/TransactionActions'

const mapStateToProps = (state) => {
    return {
        tags: state.tag.tagList,
        assetAccounts: state.account.assetAccountList,
        incomeAccounts: state.account.incomeAccountList,
        expenseAccounts: state.account.expenseAccountList,
        pageSize: state.transactionview.pageSize,
        periodBeginning: state.transaction.ui.periodBeginning,
        periodEnd: state.transaction.ui.periodEnd,
        accountFilter: state.transaction.ui.accountFilter,
        tagFilter: state.transaction.ui.tagFilter,
        commentFilter: state.transaction.ui.commentFilter
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPageFilter)
