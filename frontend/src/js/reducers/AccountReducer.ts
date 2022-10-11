import {createAction, createReducer} from "@reduxjs/toolkit";
import * as Model from '../api/model';

export const AccountsLoad = createAction('AccountsLoad');
export const AccountsStore = createAction<Model.Account[]>('AccountsStore');
export const AccountTreeStore = createAction<Record<string, Model.AccountTreeNode>>('AccountTreeStore');

export interface AccountState {
    accountList: Model.Account[];
    assetTree: Model.AccountTreeNode;
    incomeTree: Model.AccountTreeNode;
    expenseTree: Model.AccountTreeNode;
    available: boolean;
}

const initialState: AccountState = {
    accountList: [],
    assetTree: { accounts: [], categories: [] },
    incomeTree: { accounts: [], categories: [] },
    expenseTree: { accounts: [], categories: [] },
    available: false,
};

export default createReducer(initialState, builder => {
    builder
        .addCase(AccountsLoad, state => {
            state.available = false;
        })
        .addCase(AccountsStore, (state, action) => {
            state.available = true;
            state.accountList = action.payload;
        })
        .addCase(AccountTreeStore, (state, action) => {
            state.available = true;
            state.assetTree = action.payload['assetTree'];
            state.incomeTree = action.payload['incomeTree'];
            state.expenseTree = action.payload['expenseTree'];
        })
})
