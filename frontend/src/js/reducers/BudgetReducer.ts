import { produce } from 'immer';

import { Budget } from '../api/models/Budget';
import { BudgetAction } from '../actions/BudgetActions';
import { BudgetActionType } from '../constants/Budget';

export interface BudgetState {
    currentBudget?: Budget;
    selectedBudget?: Budget;
}

const initialState: BudgetState = { };

export default function budgetSelector(state: BudgetState = initialState, action: BudgetAction) {
    switch (action.type) {
        case BudgetActionType.StoreCurrentBudget:
            return produce(state, draft => {
                draft.currentBudget = action.payload;
                if (state.selectedBudget === null) {
                    // Preselect current budget
                    draft.selectedBudget = action.payload;
                }
            });
        case BudgetActionType.StoreSelectedBudget:
            return produce(state, draft => {
                draft.selectedBudget = action.payload;
            });
        default:
            return state;
    }
}
