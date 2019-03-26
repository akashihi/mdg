import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import BudgetSelectorReducer from './BudgetSelectorReducer'
import CategoryReducer from './CategoryReducer'
import CurrencyReducer from './CurrencyReducer'
import AccountViewReducer from './AccountViewReducer'
import TransactionReducer from './TransactionReducer'
import TransactionViewReducer from './TransactionViewReducer'
import TagReducer from './TagReducer'
import BudgetEntryReducer from './BudgetEntryReducer'
import SettingReducer from './SettingReducer'
import SettingViewReducer from './SettingViewReducer'
import RateReducer from './RateReducer'
import ReportReducer from './ReportReducer'

export default (history) => combineReducers({
    router: connectRouter(history),
    budget: BudgetSelectorReducer,
    category: CategoryReducer,
    currency: CurrencyReducer,
    account: AccountViewReducer,
    transaction: TransactionReducer,
    transactionview: TransactionViewReducer,
    tag: TagReducer,
    budgetentry: BudgetEntryReducer,
    setting: SettingReducer,
    settingView: SettingViewReducer,
    rate: RateReducer,
    report: ReportReducer
})
