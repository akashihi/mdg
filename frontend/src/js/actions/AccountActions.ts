import {produce} from 'immer';
import {Action} from 'redux';
import { checkApiError, parseJSON} from '../util/ApiUtils';
import {loadCurrentBudget, loadSelectedBudget} from './BudgetActions';
import { loadTotalsReport } from './ReportActions';

import { AccountActionType } from '../constants/Account'
import {Account, AccountTreeNode} from '../models/Account';
import {RootState} from '../reducers/rootReducer';
import {selectSelectedBudgetId} from '../selectors/BudgetSelector';

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

    const url = '/api/accounts?embed=currency'

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
            .catch(function () {
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


export function updateAccount (account: Partial<Account>) {
  return (dispatch, getState:()=>RootState) => {
      dispatch({type: AccountActionType.AccountsLoad, payload: [] })

      const state = getState()
      const selectedBudgetId = selectSelectedBudgetId(state);

      let url = '/api/accounts';
      let method = 'POST';
      if (account.id !== -1) {
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
          .then(() => dispatch(loadCurrentBudget()))
          .then(() => { if (selectedBudgetId) { dispatch(loadSelectedBudget(selectedBudgetId)) } })
          .catch(() => dispatch(loadAccountList()))
  }
}
