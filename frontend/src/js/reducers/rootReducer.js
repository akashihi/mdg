import { combineReducers } from 'redux'
import BudgetSelectorReducer from './BudgetSelectorReducer'
import CurrencyReducer from './CurrencyReducer'
import AccountViewReducer from './AccountViewReducer'
import TransactionReducer from './TransactionReducer'
import TransactionViewReducer from './TransactionViewReducer'
import TagReducer from './TagReducer'
import BudgetEntryReducer from './BudgetEntryReducer'

export default combineReducers({
    budget: BudgetSelectorReducer,
    currency: CurrencyReducer,
    account: AccountViewReducer,
    transaction: TransactionReducer,
    transactionview: TransactionViewReducer,
    tag: TagReducer,
    budgetentry: BudgetEntryReducer
})
