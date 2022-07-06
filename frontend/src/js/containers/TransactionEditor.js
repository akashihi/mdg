import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TransactionDialog from '../components/transaction/TransactionDialog'
import * as TransactionActions from '../actions/TransactionActions'

const mapStateToProps = (state) => {
  return {
    primaryCurrency: state.setting.primaryCurrency,
    currencies: state.currency.currencies,
    categories: state.category.categoryList,
    tags: state.tag.tags,
    accounts: state.account.accountList,
    open: state.transaction.get('dialog').get('open'),
    closeOnSave: state.transaction.get('dialog').get('closeOnSave'),
    transaction: state.transaction.get('dialog').get('transaction'),
    valid: state.transaction.get('dialog').get('valid'),
    errors: state.transaction.get('dialog').get('errors')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(TransactionActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDialog)
