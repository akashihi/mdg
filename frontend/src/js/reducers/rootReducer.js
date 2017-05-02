import { combineReducers } from 'redux'
import BudgetSelectorReducer from './BudgetSelectorReducer'
import CurrencyReducer from './CurrencyReducer'

export default combineReducers({
    budget: BudgetSelectorReducer,
    currency: CurrencyReducer
})
