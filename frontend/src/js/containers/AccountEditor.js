import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AccountDialog from '../components/AccountDialog'
import * as AccountActions from '../actions/AccountViewerActions'


const mapStateToProps = (state) => {
    return {
        categoryList: state.category.categoryList,
        currencies: state.currency.currencies,
        open: state.account.dialog.open,
        full: state.account.dialog.full,
        account: state.account.dialog.account,
        valid: state.account.dialog.valid,
        errors: state.account.dialog.errors
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AccountActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountDialog)
