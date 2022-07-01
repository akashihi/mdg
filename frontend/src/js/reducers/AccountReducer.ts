import { produce } from 'immer';
import { AccountActionType } from '../constants/Account'
import {Account, AccountTreeNode} from '../models/Account';
import {AccountAction} from '../actions/AccountActions';

export interface AccountState {
    accountList: Account[];
    assetTree: AccountTreeNode;
    incomeTree: AccountTreeNode;
    expenseTree: AccountTreeNode;
    available: boolean;
}

const initialState: AccountState = {
    accountList: [],
    assetTree: {accounts:[], categories:[]},
    incomeTree: {accounts:[], categories:[]},
    expenseTree: {accounts:[], categories:[]},
    available: false
}

export default function accountViewReducer (state: AccountState = initialState, action: AccountAction) {
  switch (action.type) {
    case AccountActionType.AccountsLoad:
        return produce(state, draft => {draft.available = false});
    case AccountActionType.AccountsStore:
        return produce(state, draft => {draft.available = true; draft.accountList = action.payload.accounts})
      case AccountActionType.AccountTreeStore:
          return produce(state, draft => {draft.available = true; draft.assetTree = action.payload.assetTree; draft.incomeTree = action.payload.incomeTree; draft.expenseTree = action.payload.expenseTree;})
      case AccountActionType.AccountsFailure:
          return produce(state, draft => {draft.available = false; draft.accountList = []})
    default:
      return state
  }
}
