import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import BudgetSelectorReducer from './BudgetReducer';
import CategoryReducer from './CategoryReducer';
import CurrencyReducer from './CurrencyReducer';
import AccountReducer from './AccountReducer';
import TransactionReducer from './TransactionReducer';
import TagReducer from './TagReducer';
import SettingReducer from './SettingReducer';
import RateReducer from './RateReducer';
import ReportReducer from './ReportReducer';
import ErrorReducer from './ErrorReducer';

const store = configureStore({
    reducer: {
        budget: BudgetSelectorReducer,
        category: CategoryReducer,
        currency: CurrencyReducer,
        account: AccountReducer,
        transaction: TransactionReducer,
        tag: TagReducer,
        setting: SettingReducer,
        rate: RateReducer,
        report: ReportReducer,
        error: ErrorReducer,
    },
});

export type GetStateFunc = typeof store.getState;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export default store;
