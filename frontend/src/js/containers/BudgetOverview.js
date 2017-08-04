import { connect } from 'react-redux'

import BudgetOverviewPanel from '../components/BudgetOverviewPanel'

const mapStateToProps = (state) => {
    return {
        budget: state.budgetentry.currentBudget,
    }
};

export default connect(mapStateToProps)(BudgetOverviewPanel)
