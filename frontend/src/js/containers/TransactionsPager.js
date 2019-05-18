import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TransactionsPagePager from '../components/transaction/TransactionsPagePager'
import * as TransactionActions from '../actions/TransactionActions'

const mapStateToProps = (state) => {
    return {
        pageSize: state.transactionview.get('pageSize'),
        pageNumber: state.transactionview.get('pageNumber'),
        count: state.transactionview.get('count'),
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPagePager)
