import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import BudgetPage from '../components/budget/BudgetPage'
import * as BudgetViewerActions from '../actions/BudgetActions'
import * as BudgetEntryActions from '../actions/BudgetEntryActions'

const mapStateToProps = (state) => {
  return {
    budget: state.get('budgetentry').get('currentBudget'),
    entries: state.get('budgetentry').get('entryList'),
    loading: state.get('budgetentry').get('ui').get('entryListLoading'),
    error: state.get('budgetentry').get('ui').get('entryListError'),
    emptyVisible: state.get('budgetentry').get('ui').get('hiddenEntriesVisible'),
    accounts: state.get('account').get('accountList'),
    currencies: state.get('currency').get('currencies')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(BudgetViewerActions, dispatch),
    entryActions: bindActionCreators(BudgetEntryActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BudgetPage)
