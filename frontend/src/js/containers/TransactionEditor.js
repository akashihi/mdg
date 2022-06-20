import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TransactionDialog from '../components/transaction/TransactionDialog'
import * as TransactionActions from '../actions/TransactionActions'

const mapStateToProps = (state) => {
  return {
    primaryCurrency: state.get('setting').get('primaryCurrency'),
    currencies: state.get('currency').get('currencies'),
    categories: state.get('category').get('categoryList'),
    tags: state.get('tag').get('tagList'),
    accounts: state.get('account').get('accountList'),
    open: state.get('transaction').get('dialog').get('open'),
    closeOnSave: state.get('transaction').get('dialog').get('closeOnSave'),
    transaction: state.get('transaction').get('dialog').get('transaction'),
    valid: state.get('transaction').get('dialog').get('valid'),
    errors: state.get('transaction').get('dialog').get('errors')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(TransactionActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDialog)
