import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import BudgetList from '../components/BudgetList'
import * as BudgetViewerActions from '../actions/BudgetViewerActions'


const mapStateToProps = (state) => {
    return {
        visible: state.budget.ui.budgetListVisible,
        waiting: state.budget.ui.budgetListLoading,
        error: state.budget.ui.budgetListError,
        budgets: state.budget.budgetList,
        valid: state.budget.newBudgetValid,
        formError: state.budget.newBudgetError
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(BudgetViewerActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BudgetList)
