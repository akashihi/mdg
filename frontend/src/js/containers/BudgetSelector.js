import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import BudgetList from '../components/BudgetList'
import * as BudgetViewerActions from '../actions/BudgetViewerActions'


const mapStateToProps = (state) => {
    return {
        visible: state.budget.ui.budgetListVisible,
        loading: state.budget.ui.budgetListLoading,
        budgets: state.budget.budgetList
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(BudgetViewerActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BudgetList)
