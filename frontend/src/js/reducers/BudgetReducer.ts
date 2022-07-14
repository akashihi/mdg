import {produce} from 'immer';

import {Budget} from "../models/Budget";
import {BudgetAction} from "../actions/BudgetActions";
import {BudgetActionType} from "../constants/Budget";

export interface BudgetState {
    currentBudget?: Budget
}

const initialState: BudgetState = {
    currentBudget: null
}

export default function budgetSelector (state:BudgetState = initialState, action: BudgetAction) {
  switch (action.type) {
      case BudgetActionType.StoreCurrentBudget:
          return produce(state, draft => {draft.currentBudget = action.payload});
    default:
      return state
  }
}
