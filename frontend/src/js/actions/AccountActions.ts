import { Map } from 'immutable';
import {Action} from 'redux';
import { checkApiError, parseJSON, dataToMap, mapToData, singleToMap } from '../util/ApiUtils';
import { loadBudgetEntryList } from './BudgetEntryActions';
import { loadTotalsReport } from './ReportActions';

import {
    GET_ACCOUNTLIST_REQUEST,
    GET_ACCOUNTLIST_SUCCESS,
    GET_ACCOUNTLIST_FAILURE,
    ACCOUNT_DIALOG_OPEN,
    ACCOUNT_DIALOG_CLOSE,
    ACCOUNT_PARTIAL_UPDATE,
    ACCOUNT_PARTIAL_SUCCESS, AccountActionType
} from '../constants/Account'
import {Account, AccountTreeNode} from "../models/Account";

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

/*

export function updateAccount (id, account) {
  return (dispatch, getState) => {
    dispatch({
      type: ACCOUNT_PARTIAL_UPDATE,
      payload: {
        id,
        account: account.set('loading', true)
      }
    })

    if (account.get('category_id') === -1) {
      // We use -1 as a fake default value to make MUI happy
      // mdg have no idea on that
      account = account.delete('category_id')
    }

    const state = getState()
    const selectedBudgetId = state.get('budgetentry').get('currentBudget').get('id')

    let url = '/api/account'
    let method = 'POST'
    if (id !== -1) {
      url = url + '/' + id
      method = 'PUT'
    }

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/vnd.mdg+json'
      },
      body: JSON.stringify(mapToData(id, account))
    })
      .then(parseJSON)
      .then(singleToMap)
      .then(checkApiError)
      .then(map => {
        if (id === -1) {
          dispatch(loadAccountList())
        } else {
          dispatch({
            type: ACCOUNT_PARTIAL_SUCCESS,
            payload: {
              id,
              account: map.first()
            }
          })
        }
      })
      .then(() => dispatch(loadTotalsReport()))
      .then(() => { if (selectedBudgetId) { dispatch(loadBudgetEntryList(selectedBudgetId)) } })
      .catch(() => dispatch(loadAccountList()))
  }
}

export function createAccount () {
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
