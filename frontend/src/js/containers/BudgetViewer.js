import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import BudgetPage from '../components/BudgetPage'
import * as BudgetViewerActions from '../actions/BudgetViewerActions'

const mapStateToProps = (state) => {
    return {
        drawerVisible: state.budget.ui.budgetListVisible,
        budget: state.budgetentry.currentBudget
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(BudgetViewerActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BudgetPage)
