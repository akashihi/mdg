import * as Model from "../api/model";
import {RootState} from "../reducers/rootReducer";
import {getSelectedBudget, selectIsNextBudgetPageAvailable, selectSelectedBudgetId} from "../selectors/BudgetSelector";
import {loadCurrentBudget, loadInitialBudgets, loadNextBudgetPage} from "../actions/BudgetActions";
import {connect} from "react-redux";
import BudgetSelector from "../components/budget/BudgetSelector";

export interface BudgetSelectorToolProps {
    apply?(number): void,
    onChange?(number): void
}

export interface BudgetSelectorState {
    budgets: Model.ShortBudget[],
    nextAvailable: boolean,
    activeBudgetId: number;
    budget?: Model.Budget;
    apply?(number): void,
    onChange?(number): void
}

const mapStateToProps = (state: RootState, ownProps: BudgetSelectorToolProps): BudgetSelectorState => {
    return {
        budgets: state.budget.budgets,
        nextAvailable: selectIsNextBudgetPageAvailable(state),
        activeBudgetId: selectSelectedBudgetId(state),
        budget: getSelectedBudget(state),
        apply: ownProps.apply,
        onChange: ownProps.onChange
    }
}

const mapDispatchToProps = {loadNextBudgetPage, loadInitialBudgets, loadCurrentBudget}

export type BudgetSelectorProps = BudgetSelectorState & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BudgetSelector);
