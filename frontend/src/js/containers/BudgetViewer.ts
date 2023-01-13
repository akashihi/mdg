import { connect } from 'react-redux';

import BudgetPage from '../components/budget/BudgetPage';
import { getSelectedBudget } from '../selectors/BudgetSelector';
import { Budget } from '../api/models/Budget';
import { RootState } from '../reducers/rootReducer';
import { reportError } from '../actions/ErrorActions';
import { loadCurrentBudget } from '../actions/BudgetActions';

export interface BudgetViewerState {
    budget?: Budget;
}

const mapStateToProps = (state: RootState): BudgetViewerState => {
    return {
        budget: getSelectedBudget(state),
    };
};

const mapDispatchToProps = { reportError, loadCurrentBudget };

export type BudgetViewerProps = BudgetViewerState & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BudgetPage);
