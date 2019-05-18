import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TransactionCreateButton from '../components/transaction/TransactionCreateButton'
import * as TransactionActions from '../actions/TransactionActions'

const mapStateToProps = () => {
    return { }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionCreateButton)
