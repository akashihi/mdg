import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TransactionDialog from '../components/TransactionDialog'
import * as TransactionActions from '../actions/TransactionActions'


const mapStateToProps = (state) => {
    return {
        primaryCurrency: state.setting.get('primaryCurrency'),
        currencies: state.currency.get('currencies'),
        tags: state.tag.get('tagList'),
        assetAccounts: state.account.get('assetAccountList'),
        incomeAccounts: state.account.get('incomeAccountList'),
        expenseAccounts: state.account.get('expenseAccountList'),
        open: state.transaction.get('dialog').get('open'),
        closeOnSave: state.transaction.get('dialog').get('closeOnSave'),
        transaction: state.transaction.get('dialog').get('transaction'),
        valid: state.transaction.get('dialog').get('valid'),
        errors: state.transaction.get('dialog').get('errors')
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDialog)
