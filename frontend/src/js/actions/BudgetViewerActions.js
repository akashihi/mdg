import { TOGGLE_BUDGET_SELECTOR } from '../constants/Budget'

export function toggleBudgetSelector(visible) {
    return {
        type: TOGGLE_BUDGET_SELECTOR,
        payload: visible
    }
}
