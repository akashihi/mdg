import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import BudgetList from '../components/BudgetList'
import * as BudgetViewerActions from '../actions/BudgetActions'


const mapStateToProps = (state) => {
    return {
        visible: state.budget.get('ui').get('budgetListVisible'),
        waiting: state.budget.get('ui').get('budgetListLoading'),
        error: state.budget.get('ui').get('budgetListError'),
        budgets: state.budget.get('budgetList'),
        valid: state.budget.get('newBudgetValid'),
        formError: state.budget.get('newBudgetError'),
        begin: state.budget.get('newBudgetBegin'),
        end:state.budget.get('newBudgetEnd'),
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(BudgetViewerActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BudgetList)
