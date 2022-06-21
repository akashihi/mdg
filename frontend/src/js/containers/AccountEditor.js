import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AccountDialog from '../components/account/AccountDialog'
import * as AccountActions from '../actions/AccountActions'

const mapStateToProps = (state) => {
  return {
    categoryList: state.get('category').get('categoryList'),
    currencies: state.get('currency').get('currencies'),
    open: state.get('account').getIn(['dialog', 'open']),
    full: state.get('account').getIn(['dialog', 'full']),
    account: state.get('account').getIn(['dialog', 'account']),
    valid: state.get('account').getIn(['dialog', 'valid']),
    errors: state.get('account').getIn(['dialog', 'errors'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(AccountActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountDialog)
