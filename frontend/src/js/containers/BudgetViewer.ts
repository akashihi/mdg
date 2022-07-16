import { connect } from 'react-redux';

import BudgetPage from '../components/budget/BudgetPage';
import { loadSelectedBudget } from '../actions/BudgetActions';
import { getSelectedBudget } from '../selectors/BudgetSelector';
import { Budget } from '../models/Budget';
import { RootState } from '../reducers/rootReducer';

export interface BudgetViewerState {
    budget?: Budget;
}

const mapStateToProps = (state: RootState): BudgetViewerState => {
    return {
        budget: getSelectedBudget(state),
    };
};

const mapDispatchToProps = { loadSelectedBudget };

export type BudgetViewerProps = BudgetViewerState & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BudgetPage);
