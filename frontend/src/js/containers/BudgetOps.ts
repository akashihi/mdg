import { connect } from 'react-redux';

import BudgetList from '../components/budget/BudgetList';
import * as Model from '../api/model';
import {getSelectedBudget, selectIsNextBudgetPageAvailable} from '../selectors/BudgetSelector';
import { RootState } from '../reducers/rootReducer';
import {
    loadSelectedBudget,
    loadInitialBudgets,
    deleteBudget,
    createBudget
} from '../actions/BudgetActions';
import { selectSelectedBudgetId } from '../selectors/BudgetSelector';

export interface BudgetOpState {
    budget?: Model.Budget;
    activeBudgetId: number;
    budgets: Model.ShortBudget[],
    nextAvailable: boolean
}

const mapStateToProps = (state: RootState): BudgetOpState => {
    return {
        budget: getSelectedBudget(state),
        activeBudgetId: selectSelectedBudgetId(state),
        budgets: state.budget.budgets,
        nextAvailable: selectIsNextBudgetPageAvailable(state)
    };
};

const mapDispatchToProps = { loadSelectedBudget, deleteBudget, createBudget };

export type BudgetOpsProps = BudgetOpState & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BudgetList);
