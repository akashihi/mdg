import * as Model from "../api/model";
import {RootState} from "../reducers/rootReducer";
import {selectIsNextBudgetPageAvailable, selectSelectedBudgetId} from "../selectors/BudgetSelector";
import {loadInitialBudgets, loadNextBudgetPage} from "../actions/BudgetActions";
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
    apply?(number): void,
    onChange?(number): void
}

const mapStateToProps = (state: RootState, ownProps: BudgetSelectorToolProps): BudgetSelectorState => {
    return {
        budgets: state.budget.budgets,
        nextAvailable: selectIsNextBudgetPageAvailable(state),
        activeBudgetId: selectSelectedBudgetId(state),
        apply: ownProps.apply,
        onChange: ownProps.onChange
    }
}

const mapDispatchToProps = {loadNextBudgetPage, loadInitialBudgets}

export type BudgetSelectorProps = BudgetSelectorState & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BudgetSelector);
