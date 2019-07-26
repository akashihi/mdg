import { connect } from 'react-redux'

import {selectTransactions} from '../selectors/TransactionSelector'

import TransactionsOverviewPanel from '../components/transaction/TransactionsOverviewPanel'

const mapStateToProps = (state) => {
    return {
        transactions: selectTransactions(state),
    }
};

export default connect(mapStateToProps)(TransactionsOverviewPanel)
