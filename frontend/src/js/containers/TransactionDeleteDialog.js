import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {getTransactionToDeleteId} from '../selectors/StateGetters'
import {selectTransactionToDeleteName} from '../selectors/TransactionDeleteSelector'

import TransactionDeleteConfirmation from '../components/transaction/TransactionDeleteConfirmation'
import * as TransactionActions from '../actions/TransactionActions'

const mapStateToProps = (state) => {
    return {
        id: getTransactionToDeleteId(state),
        name: selectTransactionToDeleteName(state),
        visible: state.transaction.get('delete').get('approvementDialogVisible'),
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDeleteConfirmation)
