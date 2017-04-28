import { TOGGLE_BUDGET_SELECTOR } from '../constants/Budget'

const initialState = {
        ui: {
            budgetListVisible: false
        }

};

export default function budgetSelector(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_BUDGET_SELECTOR:
            return Object.assign({}, state, {ui: {budgetListVisible: action.payload}});
        default:
            return state
    }
}
