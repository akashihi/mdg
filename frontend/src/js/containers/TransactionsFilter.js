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
        periodBeginning: state.transactionview.periodBeginning,
        periodEnd: state.transactionview.periodEnd,
        accountFilter: state.transactionview.accountFilter,
        tagFilter: state.transactionview.tagFilter,
        commentFilter: state.transactionview.commentFilter
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPageFilter)
