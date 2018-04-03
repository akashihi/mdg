import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import BudgetSelectorReducer from './BudgetSelectorReducer'
import CurrencyReducer from './CurrencyReducer'
import AccountViewReducer from './AccountViewReducer'
import TransactionReducer from './TransactionReducer'
import TransactionViewReducer from './TransactionViewReducer'
import TagReducer from './TagReducer'
import BudgetEntryReducer from './BudgetEntryReducer'
import SettingReducer from './SettingReducer'
import SettingViewReducer from './SettingViewReducer'

export default combineReducers({
    router,
    budget: BudgetSelectorReducer,
    currency: CurrencyReducer,
    account: AccountViewReducer,
    transaction: TransactionReducer,
    transactionview: TransactionViewReducer,
    tag: TagReducer,
    budgetentry: BudgetEntryReducer,
    setting: SettingReducer,
    settingView: SettingViewReducer
})
