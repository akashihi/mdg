import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import BudgetPage from '../components/BudgetPage'
import * as BudgetViewerActions from '../actions/BudgetActions'
import * as BudgetEntryActions from '../actions/BudgetEntryActions'

const mapStateToProps = (state) => {
    return {
        budget: state.budgetentry.currentBudget,
        entries: state.budgetentry.entryList,
        loading: state.budgetentry.ui.entryListLoading,
        error: state.budgetentry.ui.entryListError,
        emptyVisible: state.budgetentry.ui.hiddenEntriesVisible,
        accounts: state.account.get('accountList'),
        currencies: state.currency.get('currencies'),
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(BudgetViewerActions, dispatch),
        entryActions: bindActionCreators(BudgetEntryActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BudgetPage)
