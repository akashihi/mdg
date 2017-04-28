import { combineReducers } from 'redux'
import BudgetSelectorReducer from './BudgetSelectorReducer'

export default combineReducers({
    budget: BudgetSelectorReducer
})
