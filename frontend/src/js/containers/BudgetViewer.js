import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import BudgetPage from '../components/BudgetPage'
import * as BudgetViewerActions from '../actions/BudgetActions'
import * as BudgetEntryActions from '../actions/BudgetEntryActions'

const mapStateToProps = (state) => {
    return {
        budget: state.budgetentry.get('currentBudget'),
        entries: state.budgetentry.get('entryList'),
        loading: state.budgetentry.get('ui').get('entryListLoading'),
        error: state.budgetentry.get('ui').get('entryListError'),
        emptyVisible: state.budgetentry.get('ui').get('hiddenEntriesVisible'),
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
