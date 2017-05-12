import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AccountDialog from '../components/AccountDialog'
import * as AccountActions from '../actions/AccountViewerActions'


const mapStateToProps = (state) => {
    return {
        currencies: state.currency.currencyList,
        open: state.account.dialog.open
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AccountActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountDialog)
