import { combineReducers } from 'redux'
import BudgetSelectorReducer from './BudgetSelectorReducer'
import CurrencyReducer from './CurrencyReducer'
import AccountViewReducer from './AccountViewReducer'

export default combineReducers({
    budget: BudgetSelectorReducer,
    currency: CurrencyReducer,
    account: AccountViewReducer
})
