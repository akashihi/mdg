import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import BudgetPage from '../components/BudgetPage'
import * as BudgetViewerActions from '../actions/BudgetViewerActions'
import * as BudgetEntryActions from '../actions/BudgetEntryActions'

const mapStateToProps = (state) => {
    return {
        drawerVisible: state.budget.ui.budgetListVisible,
        budget: state.budgetentry.currentBudget,
        entries: state.budgetentry.entryList,
        loading: state.budgetentry.ui.entryListLoading,
        error: state.budgetentry.ui.entryListError,
        emptyVisible: state.budgetentry.ui.hiddenEntriesVisible,
        assetAccounts: state.account.assetAccountList,
        incomeAccounts: state.account.incomeAccountList,
        expenseAccounts: state.account.expenseAccountList,
        currencies: state.currency.currencies
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(BudgetViewerActions, dispatch),
        entryActions: bindActionCreators(BudgetEntryActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BudgetPage)
