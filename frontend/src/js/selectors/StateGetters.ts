import Currency from "../models/Currency";
import {RootState} from "../reducers/rootReducer";

// Transaction view
export const getPeriodBeginning = state => state.get('transactionview').get('periodBeginning');
export const getPeriodEnd = state => state.get('transactionview').get('periodEnd');
export const getSelectedTransactions = state => state.get('transactionview').get('selection');

// Transaction
export const getTransactions = state => state.get('transaction').get('transactionList');

// Transaction deletion dialog
export const getTransactionToDeleteId = state => state.get('transaction').get('delete').get('id');

// Accounts
export const getAccounts = state => state.get('account').get('accountList');

// Budget
export const getCurrentBudgetId = state => state.get('budgetentry').get('currentBudget').get('id');

// Currency
export const getCurrencies = (state):Currency[] => state.get('currency').currencies;
