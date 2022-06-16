import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {selectBeginningDate, selectEndDate, selectMarkedTransactionsTotals} from '../selectors/TransactionViewSelector'
import {selectTransactions} from '../selectors/TransactionSelector'


import TransactionsPage from '../components/transaction/TransactionsPage'
import * as TransactionActions from '../actions/TransactionActions'
import * as TagActions from '../actions/TagActions'


const mapStateToProps = (state) => {
    return {
        waiting: state.transaction.get('ui').get('transactionListLoading'),
        error: state.transaction.get('ui').get('transactionListError'),
        selectedTotals: selectMarkedTransactionsTotals(state),
        transactions: selectTransactions(state),
        periodBeginning: selectBeginningDate(state),
        periodEnd: selectEndDate(state)
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionActions, dispatch),
        tagActions: bindActionCreators(TagActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPage)
