import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import BudgetList from '../components/BudgetList'
import * as BudgetViewerActions from '../actions/BudgetViewerActions'


const mapStateToProps = (state) => {
    return {
        visible: state.budget.ui.budgetListVisible
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(BudgetViewerActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BudgetList)
