import { connect } from 'react-redux';

import BudgetList from '../components/budget/BudgetList';
import { Budget } from '../api/model';
import { getSelectedBudget } from '../selectors/BudgetSelector';
import { RootState } from '../reducers/rootReducer';
import { loadSelectedBudget, loadCurrentBudget } from '../actions/BudgetActions';
import { selectSelectedBudgetId } from '../selectors/BudgetSelector';

export interface BudgetSelectorState {
    budget?: Budget;
    selectedBudgetId: number;
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
