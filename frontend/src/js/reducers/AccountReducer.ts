import { produce } from 'immer';
import {
    AccountActionType,
    GET_ACCOUNTLIST_REQUEST,
    GET_ACCOUNTLIST_SUCCESS,
} from '../constants/Account'
import {Account} from '../models/Account';
import {AccountAction} from '../actions/AccountActions';

export interface AccountState {
    accountList: Account[];
    available: boolean
}

const initialState: AccountState = {
    accountList: [],
    available: false
}

export default function accountViewReducer (state: AccountState = initialState, action: AccountAction) {
  switch (action.type) {
    /*case ACCOUNT_DIALOG_OPEN:
      return state.setIn(['dialog', 'open'], true)
        .setIn(['dialog', 'full'], action.payload.full)
        .setIn(['dialog', 'id'], action.payload.id)
        .setIn(['dialog', 'account'], action.payload.account)
    case ACCOUNT_DIALOG_CLOSE:
      return state.setIn(['dialog', 'open'], false)
    case ACCOUNT_PARTIAL_UPDATE:
    case ACCOUNT_PARTIAL_SUCCESS:
      newAccountState = state.setIn(['accountList', action.payload.id], action.payload.account)
        .setIn(['ui', 'accountListLoading'], false)
      return splitAccountList(newAccountState)*/
    case AccountActionType.AccountsLoad:
        return produce(state, draft => {draft.available = false});
    case AccountActionType.AccountsStore:
        return produce(state, draft => {draft.available = true; draft.accountList = action.payload})
      case AccountActionType.AccountsFailure:
          return produce(state, draft => {draft.available = false; draft.accountList = []})
/*    case TOGGLE_HIDDEN_ACCOUNTS:
      return state.setIn(['ui', 'hiddenAccountsVisible'], action.payload)*/
    default:
      return state
  }
}
