import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TransactionDialog from '../components/TransactionDialog'
import * as TransactionActions from '../actions/TransactionViewerActions'


const mapStateToProps = (state) => {
    return {
        currencies: state.currency.currencyList,
        assetAccounts: state.account.assetAccountList,
        incomeAccounts: state.account.incomeAccountList,
        expenseAccounts: state.account.expenseAccountList,
        open: true,
        valid: true
        /*open: state.account.dialog.open,
        full: state.account.dialog.full,
        account: state.account.dialog.account,
        valid: state.account.dialog.valid,
        errors: state.account.dialog.errors*/
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDialog)
