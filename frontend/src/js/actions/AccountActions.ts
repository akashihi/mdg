import {produce} from 'immer';
import {Action} from 'redux';
import { checkApiError, parseJSON} from '../util/ApiUtils';
import { loadBudgetEntryList } from './BudgetEntryActions';
import { loadTotalsReport } from './ReportActions';

import { AccountActionType } from '../constants/Account'
import {Account, AccountTreeNode} from "../models/Account";
import {RootState} from "../reducers/rootReducer";

export interface AccountAction extends Action {
    payload: {
        accounts?: Account[];
        assetTree?: AccountTreeNode;
        incomeTree?: AccountTreeNode;
        expenseTree?: AccountTreeNode;
    };
}

export function loadAccountList () {
  return (dispatch) => {
    dispatch({type: AccountActionType.AccountsLoad, payload: [] })

    const url = '/api/accounts'

    fetch(url)
      .then(parseJSON)
      .then(checkApiError)
      .then(function (data: any) {
        dispatch({
          type: AccountActionType.AccountsStore,
          payload: {accounts: data.accounts}
        })
      })
        .then(() => dispatch(loadAccountTree()))
      .catch(function () {
        dispatch({
          type: AccountActionType.AccountsFailure,
          payload: []
        })
      })
  }
}

export function loadAccountTree () {
    return (dispatch) => {
        dispatch({type: AccountActionType.AccountsLoad, payload: [] })

        const url = '/api/accounts/tree?embed=currency,category'

        fetch(url)
            .then(parseJSON)
            .then(checkApiError)
            .then(function (data: any) {
                dispatch({
                    type: AccountActionType.AccountTreeStore,
                    payload: {assetTree: data.asset, incomeTree: data.income, expenseTree: data.expense}
                })
            })
            .catch(function (response) {
                dispatch({
                    type: AccountActionType.AccountsFailure,
                    payload: []
                })
            })
    }
}

export function setFavorite(account: Account, favorite: boolean) {
    return (dispatch) => {
        const updatedAccount: Account = produce(draft => {draft.favorite = favorite})(account);
        dispatch(updateAccount(updatedAccount))
    }
}

export function setOperational(account: Account, operational: boolean) {
    return (dispatch) => {
        const updatedAccount: Account = produce(draft => {draft.operational = operational})(account);
        dispatch(updateAccount(updatedAccount))
    }
}

export function revealAccount(account: Account) {
    return (dispatch) => {
        const updatedAccount: Account = produce(draft => {draft.hidden = false})(account);
        dispatch(updateAccount(updatedAccount))
    }
}

export function hideAccount(account:Account) {
    return (dispatch) => {
        dispatch({type: AccountActionType.AccountsLoad, payload: [] })

        const url = `/api/accounts/${account.id}`;
        const method = 'DELETE';

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/vnd.mdg+json;version=1'
            }
        })
            .then(parseJSON)
            .then(checkApiError)
            .then(() => dispatch(loadAccountList()))
            .catch(() => dispatch(loadAccountList()));
    }
}


export function updateAccount (account) {
  return (dispatch, getState:()=>RootState) => {
      dispatch({type: AccountActionType.AccountsLoad, payload: [] })

      const state = getState()
      const selectedBudgetId = (state.budgetentry as any).get('currentBudget').get('id');

      let url = '/api/accounts';
      let method = 'POST';
      if (account.id !== undefined) {
          url = `/api/accounts/${account.id}`;
          method = 'PUT';
      }

      fetch(url, {
          method,
          headers: {
              'Content-Type': 'application/vnd.mdg+json;version=1'
          },
          body: JSON.stringify(account)
      })
          .then(parseJSON)
          .then(checkApiError)
          .then(() => dispatch(loadAccountList()))
          .then(() => dispatch(loadTotalsReport()))
          .then(() => { if (selectedBudgetId) { dispatch(loadBudgetEntryList(selectedBudgetId)) } })
          .catch(() => dispatch(loadAccountList()))
  }
      /*

      if (account.get('category_id') === -1) {
        // We use -1 as a fake default value to make MUI happy
        // mdg have no idea on that
        account = account.delete('category_id')
      }*/
}

/*export function createAccount () {
  return (dispatch, getState) => {
    const state = getState()

    dispatch({
      type: ACCOUNT_DIALOG_OPEN,
      payload: {
        full: true,
        id: -1,
        account: Map({ name: '', account_type: 'asset', balance: 0, currency_id: state.get('setting').get('primaryCurrency') })
      }
    })
  }
}

export function editAccount (id, account) {
  return {
    type: ACCOUNT_DIALOG_OPEN,
    payload: {
      full: false,
      id,
      account
    }
  }
}

export function editAccountCancel () {
  return {
    type: ACCOUNT_DIALOG_CLOSE,
    payload: true
  }
}

export function editAccountSave (account) {
  return (dispatch, getState) => {
    dispatch({
      type: ACCOUNT_DIALOG_CLOSE,
      payload: true
    })
    dispatch({
      type: GET_ACCOUNTLIST_REQUEST,
      payload: true
    })
    const state = getState()
    const id = state.get('account').getIn(['dialog', 'id'])
    dispatch(updateAccount(id, account))
  }
}*/
