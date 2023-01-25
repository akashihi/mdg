import { connect } from 'react-redux';

import BudgetList from '../components/budget/BudgetList';
import * as Model from '../api/model';
import {getSelectedBudget, selectIsNextBudgetPageAvailable} from '../selectors/BudgetSelector';
import { RootState } from '../reducers/rootReducer';
import {
    loadSelectedBudget,
    loadInitialBudgets,
    deleteBudget,
    createBudget, loadNextBudgetPage
} from '../actions/BudgetActions';
import { selectSelectedBudgetId } from '../selectors/BudgetSelector';

export interface BudgetSelectorState {
    budget?: Model.Budget;
    selectedBudgetId: number;
    budgets: Model.ShortBudget[],
    nextAvailable: boolean
}

const mapStateToProps = (state: RootState): BudgetSelectorState => {
    return {
        budget: getSelectedBudget(state),
        selectedBudgetId: selectSelectedBudgetId(state),
        budgets: state.budget.budgets,
        nextAvailable: selectIsNextBudgetPageAvailable(state)
    };
};

const mapDispatchToProps = { loadSelectedBudget, loadInitialBudgets, deleteBudget, createBudget, loadNextBudgetPage };

export type BudgetSelectorProps = BudgetSelectorState & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BudgetList);
