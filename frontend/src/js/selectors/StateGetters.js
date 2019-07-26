//Transaction view
export const getPeriodBeginning = state => state.transactionview.get('periodBeginning');
export const getPeriodEnd = state => state.transactionview.get('periodEnd');

//Transaction
export const getTransactions = state => state.transaction.get('transactionList');

//Accounts
export const getAccounts = state => state.account.get('accountList');
