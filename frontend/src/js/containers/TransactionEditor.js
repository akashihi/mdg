import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TransactionDialog from '../components/TransactionDialog'
import * as TransactionActions from '../actions/TransactionActions'


const mapStateToProps = (state) => {
    return {
        primaryCurrency: state.setting.primaryCurrency,
        currencies: state.currency.get('currencies'),
        tags: state.tag.tagList,
        assetAccounts: state.account.assetAccountList,
        incomeAccounts: state.account.incomeAccountList,
        expenseAccounts: state.account.expenseAccountList,
        open: state.transaction.dialog.open,
        closeOnSave: state.transaction.dialog.closeOnSave,
        transaction: state.transaction.dialog.transaction,
        valid: state.transaction.dialog.valid,
        errors: state.transaction.dialog.errors
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDialog)
