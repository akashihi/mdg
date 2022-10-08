import { RootState } from '../reducers/rootReducer';
import * as Model from "../api/model";
import { SettingState } from '../reducers/SettingReducer';
import { Account } from '../api/models/Account';
import { Transaction } from '../api/models/Transaction';
import { BudgetState } from '../reducers/BudgetReducer';

// Transaction
export const getLastTransactions = (state: RootState): Transaction[] => state.transaction.lastTransactionList;

// Accounts
export const getAccounts = (state: RootState): Account[] => state.account.accountList;

// Budget
export const getBudgets = (state: RootState): BudgetState => state.budget;

// Currency
export const getCurrencies = (state: RootState): Model.Currency[] => state.currency.currencies;

// Rate
export const getRates = (state: RootState): Model.Rate[] => state.rate.rateList;

// Settings
export const getSettings = (state: RootState): SettingState => state.setting;
