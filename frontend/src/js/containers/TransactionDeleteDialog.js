import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TransactionDeleteConfirmation from '../components/TransactionDeleteConfirmation'
import * as TransactionActions from '../actions/TransactionActions'

const mapStateToProps = (state) => {
    return {
        transaction: state.transaction.get('delete').get('transaction'),
        visible: state.transaction.get('delete').get('approvementDialogVisible'),
        loading: state.transaction.get('delete').get('loading')
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDeleteConfirmation)
