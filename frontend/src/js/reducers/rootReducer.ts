import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import {useDispatch} from 'react-redux';
import thunk from 'redux-thunk';
import BudgetSelectorReducer from './BudgetReducer';
import CategoryReducer from './CategoryReducer';
import CurrencyReducer from './CurrencyReducer';
import AccountReducer from './AccountReducer';
import TransactionReducer from './TransactionReducer';
import TransactionViewReducer from './TransactionViewReducer';
import TagReducer from './TagReducer';
import BudgetEntryReducer from './BudgetEntryReducer';
import SettingReducer from './SettingReducer';
import RateReducer from './RateReducer';
import ReportReducer from './ReportReducer';

const rootReducer =  () => combineReducers({
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
});

const store = createStore(rootReducer(), compose(applyMiddleware(thunk)));


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch
export default store;
