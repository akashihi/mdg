import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { useDispatch } from 'react-redux';
import thunk from 'redux-thunk';
import BudgetSelectorReducer from './BudgetReducer';
import CategoryReducer from './CategoryReducer';
import CurrencyReducer from './CurrencyReducer';
import AccountReducer from './AccountReducer';
import TransactionReducer from './TransactionReducer';
import TagReducer from './TagReducer';
import SettingReducer from './SettingReducer';
import RateReducer from './RateReducer';
import ReportReducer from './ReportReducer';

const rootReducer = () =>
    combineReducers({
        budget: BudgetSelectorReducer,
        category: CategoryReducer,
        currency: CurrencyReducer,
        account: AccountReducer,
        transaction: TransactionReducer,
        tag: TagReducer,
        setting: SettingReducer,
        rate: RateReducer,
        report: ReportReducer,
    });

const store = createStore(rootReducer(), compose(applyMiddleware(thunk)));

export type GetStateFunc = typeof store.getState;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export default store;
