import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import BudgetList from '../components/BudgetList'
import * as BudgetViewerActions from '../actions/BudgetActions'


const mapStateToProps = (state) => {
    return {
        visible: state.budget.ui.budgetListVisible,
        waiting: state.budget.ui.budgetListLoading,
        error: state.budget.ui.budgetListError,
        budgets: state.budget.budgetList,
        valid: state.budget.newBudgetValid,
        formError: state.budget.newBudgetError,
        begin: state.budget.newBudgetBegin,
        end:state.budget.newBudgetEnd,
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(BudgetViewerActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BudgetList)
