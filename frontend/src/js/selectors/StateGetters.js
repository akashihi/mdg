//Transaction view
export const getPeriodBeginning = state => state.transactionview.get('periodBeginning');
export const getPeriodEnd = state => state.transactionview.get('periodEnd');
export const getSelectedTransactions = state => state.transactionview.get('selection');

//Transaction
export const getTransactions = state => state.transaction.get('transactionList');

//Transaction deletion dialog
export const getTransactionToDeleteId = state => state.transaction.get('delete').get('id');

//Accounts
export const getAccounts = state => state.account.get('accountList');

//Budget
export const getCurrentBudgetId = state => state.budgetentry.get('currentBudget').get('id');
