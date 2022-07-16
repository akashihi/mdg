import { connect } from 'react-redux';

import BudgetList from '../components/budget/BudgetList';
import { Budget } from '../models/Budget';
import { getSelectedBudget } from '../selectors/BudgetSelector';
import { RootState } from '../reducers/rootReducer';
import { loadSelectedBudget, loadCurrentBudget } from '../actions/BudgetActions';
import { selectSelectedBudgetId } from '../selectors/BudgetSelector';

export interface BudgetSelectorState {
    budget?: Budget;
    selectedBudgetId: string;
}

const mapStateToProps = (state: RootState): BudgetSelectorState => {
    return {
        budget: getSelectedBudget(state),
        selectedBudgetId: selectSelectedBudgetId(state),
    };
};

const mapDispatchToProps = { loadCurrentBudget, loadSelectedBudget };

export type BudgetSelectorProps = BudgetSelectorState & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BudgetList);
