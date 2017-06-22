import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TransactionDeleteConfirmation from '../components/TransactionDeleteConfirmation'
import * as TransactionActions from '../actions/TransactionViewerActions'

const mapStateToProps = (state) => {
    return {
        transaction: state.transaction.delete.transaction,
        visible: state.transaction.delete.approvementDialogVisible,
        loading: state.transaction.delete.loading
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDeleteConfirmation)
