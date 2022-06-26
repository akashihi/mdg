export const GET_ACCOUNTLIST_REQUEST = 'GET_ACCOUNTLIST_REQUEST';
export const GET_ACCOUNTLIST_SUCCESS = 'GET_ACCOUNTLIST_SUCCESS';
export const GET_ACCOUNTLIST_FAILURE = 'GET_ACCOUNTLIST_FAILURE';

export const ACCOUNT_PARTIAL_UPDATE = 'ACCOUNT_PARTIAL_UPDATE';
export const ACCOUNT_PARTIAL_SUCCESS = 'ACCOUNT_PARTIAL_SUCCESS';

export const TOGGLE_HIDDEN_ACCOUNTS = 'TOGGLE_HIDDEN_ACCOUNTS';

export const ACCOUNT_DIALOG_OPEN = 'ACCOUNT_DIALOG_OPEN';
export const ACCOUNT_DIALOG_CLOSE = 'ACCOUNT_DIALOG_CLOSE';

export enum AccountActionType {
    AccountsLoad = "AccountsLoad",
    AccountsStore = "AccountsStore",
    AccountsFailure = "AccountsFailure",
    AccountPartialUpdate = "AccountPartialUpdate",
    AccountPartialSiccess = "AccountPartialSuccess"
}
