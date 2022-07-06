import Currency from '../models/Currency';
import {RootState} from '../reducers/rootReducer';
import Rate from '../models/Rate';
import {SettingState} from '../reducers/SettingReducer';
import {Account} from "../models/Account";
import {Transaction} from "../models/Transaction";

// Transaction view
export const getPeriodBeginning = state => state.transactionview.get('periodBeginning');
export const getPeriodEnd = state => state.transactionview.get('periodEnd');
export const getSelectedTransactions = state => state.transactionview.get('selection');

// Transaction
export const getLastTransactions = (state: RootState): Transaction[] => state.transaction.lastTransactionList;

// Transaction deletion dialog
export const getTransactionToDeleteId = state => state.transaction.get('delete').get('id');

// Accounts
export const getAccounts = (state: RootState): Account[] => state.account.accountList;

// Budget
export const getCurrentBudgetId = state => state.budgetentry.get('currentBudget').get('id');

// Currency
export const getCurrencies = (state: RootState): Currency[] => state.currency.currencies;

// Rate
export const getRates = (state: RootState): Rate[] => state.rate.rateList;

// Settings
export const getSettings = (state: RootState): SettingState => state.setting
