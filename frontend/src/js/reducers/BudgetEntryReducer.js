import { SET_CURRENT_BUDGET } from '../constants/BudgetEntry'

const initialState = {
    currentBudget: {}
};

export default function budgetEntryReducer(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_BUDGET:
            return {...state, currentBudget: action.payload};
        default:
            return state
    }
}
