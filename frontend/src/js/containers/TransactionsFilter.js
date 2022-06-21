import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TransactionsPageFilter from '../components/transaction/TransactionsPageFilter'
import * as TransactionActions from '../actions/TransactionActions'

const mapStateToProps = (state) => {
  return {
    tags: state.get('tag').get('tagList'),
    currencies: state.get('currency').get('currencies'),
    categories: state.get('category').get('categoryList'),
    accounts: state.get('account').get('accountList'),
    pageSize: state.get('transactionview').get('pageSize'),
    periodBeginning: state.get('transactionview').get('periodBeginning'),
    periodEnd: state.get('transactionview').get('periodEnd'),
    accountFilter: state.get('transactionview').get('accountFilter'),
    tagFilter: state.get('transactionview').get('tagFilter'),
    commentFilter: state.get('transactionview').get('commentFilter')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(TransactionActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPageFilter)
