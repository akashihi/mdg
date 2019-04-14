import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TransactionsPageFilter from '../components/TransactionsPageFilter'
import * as TransactionActions from '../actions/TransactionActions'

const mapStateToProps = (state) => {
    return {
        tags: state.tag.get('tagList'),
        categories: state.category.get('categoryList'),
        accounts: state.account.get('accountList'),
        pageSize: state.transactionview.get('pageSize'),
        periodBeginning: state.transactionview.get('periodBeginning'),
        periodEnd: state.transactionview.get('periodEnd'),
        accountFilter: state.transactionview.get('accountFilter'),
        tagFilter: state.transactionview.get('tagFilter'),
        commentFilter: state.transactionview.get('commentFilter')
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPageFilter)
