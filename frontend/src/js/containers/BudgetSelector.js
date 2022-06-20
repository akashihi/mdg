import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import BudgetList from '../components/budget/BudgetList'
import * as BudgetViewerActions from '../actions/BudgetActions'

const mapStateToProps = (state) => {
  return {
    budget: state.get('budgetentry').get('currentBudget'),
    budgets: state.get('budget').get('budgetList'),
    waiting: state.get('budget').get('ui').get('budgetListLoading'),
    error: state.get('budget').get('ui').get('budgetListError')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(BudgetViewerActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BudgetList)
