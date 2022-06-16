import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import BudgetSelectorReducer from './BudgetReducer'
import CategoryReducer from './CategoryReducer'
import CurrencyReducer from './CurrencyReducer'
import AccountReducer from './AccountReducer'
import TransactionReducer from './TransactionReducer'
import TransactionViewReducer from './TransactionViewReducer'
import TagReducer from './TagReducer'
import BudgetEntryReducer from './BudgetEntryReducer'
import SettingReducer from './SettingReducer'
import RateReducer from './RateReducer'
import ReportReducer from './ReportReducer'

export default (history) => combineReducers({
    router: connectRouter(history),
    budget: BudgetSelectorReducer,
    category: CategoryReducer,
    currency: CurrencyReducer,
    account: AccountReducer,
    transaction: TransactionReducer,
    transactionview: TransactionViewReducer,
    tag: TagReducer,
    budgetentry: BudgetEntryReducer,
    setting: SettingReducer,
    rate: RateReducer,
    report: ReportReducer
})
