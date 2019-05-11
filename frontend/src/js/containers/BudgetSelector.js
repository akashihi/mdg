import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import BudgetList from '../components/BudgetList'
import * as BudgetViewerActions from '../actions/BudgetActions'


const mapStateToProps = (state) => {
    return {
        budget: state.budgetentry.get('currentBudget'),
        budgets: state.budget.get('budgetList'),
        waiting: state.budget.get('ui').get('budgetListLoading'),
        error: state.budget.get('ui').get('budgetListError')
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(BudgetViewerActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BudgetList)
