import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AccountDialog from '../components/AccountDialog'
import * as AccountActions from '../actions/AccountActions'


const mapStateToProps = (state) => {
    return {
        categoryList: state.category.get('categoryList'),
        currencies: state.currency.get('currencies'),
        open: state.account.getIn(['dialog', 'open']),
        full: state.account.getIn(['dialog', 'full']),
        account: state.account.getIn(['dialog', 'account']),
        valid: state.account.getIn(['dialog', 'valid']),
        errors: state.account.getIn(['dialog', 'errors'])
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AccountActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountDialog)
