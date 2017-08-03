import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TransactionsPagePager from '../components/TransactionsPagePager'
import * as TransactionActions from '../actions/TransactionActions'

const mapStateToProps = (state) => {
    return {
        pageSize: state.transactionview.pageSize,
        pageNumber: state.transactionview.pageNumber,
        count: state.transactionview.count,
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPagePager)
