import Currency from '../models/Currency';
import {RootState} from '../reducers/rootReducer';
import Rate from '../models/Rate';
import {SettingState} from '../reducers/SettingReducer';
import {Account} from '../models/Account';
import {Transaction} from '../models/Transaction';
import {BudgetState} from "../reducers/BudgetReducer";

// Transaction
export const getLastTransactions = (state: RootState): Transaction[] => state.transaction.lastTransactionList;

// Accounts
export const getAccounts = (state: RootState): Account[] => state.account.accountList;

// Budget
export const getBudgets = (state:RootState): BudgetState => state.budget;

// Currency
export const getCurrencies = (state: RootState): Currency[] => state.currency.currencies;

// Rate
export const getRates = (state: RootState): Rate[] => state.rate.rateList;

// Settings
export const getSettings = (state: RootState): SettingState => state.setting
