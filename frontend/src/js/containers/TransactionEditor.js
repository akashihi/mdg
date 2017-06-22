import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TransactionDialog from '../components/TransactionDialog'
import * as TransactionActions from '../actions/TransactionViewerActions'


const mapStateToProps = (state) => {
    return {
        currencies: state.currency.currencyList,
        tags: state.tag.tagList,
        assetAccounts: state.account.assetAccountList,
        incomeAccounts: state.account.incomeAccountList,
        expenseAccounts: state.account.expenseAccountList,
        open: state.transaction.dialog.open,
        transaction: state.transaction.dialog.transaction,
        valid: true
        /*
        full: state.account.dialog.full,
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
