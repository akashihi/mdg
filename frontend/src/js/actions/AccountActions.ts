import { produce } from 'immer';
import { Action } from 'redux';
import * as API from '../api/api';
import { loadCurrentBudget, loadSelectedBudget } from './BudgetActions';
import { loadTotalsReport } from './ReportActions';

import { AccountActionType } from '../constants/Account';
import { Account, AccountTreeNode } from '../api/models/Account';
import {GetStateFunc, RootState} from '../reducers/rootReducer';
import { selectSelectedBudgetId } from '../selectors/BudgetSelector';
import {wrap} from "./base";

export interface AccountAction extends Action {
    payload: {
        accounts?: Account[];
        assetTree?: AccountTreeNode;
        incomeTree?: AccountTreeNode;
        expenseTree?: AccountTreeNode;
    };
}

export function loadAccountList() {
    return wrap(async dispatch => {
        dispatch({ type: AccountActionType.AccountsLoad, payload: [] });

        const result = await API.listAccounts();

        if (result.ok) {
            dispatch({
                type: AccountActionType.AccountsStore,
                payload: { accounts: result.val },
            });
            await dispatch(loadAccountTree());
        } else {
            dispatch({
                type: AccountActionType.AccountsFailure,
                payload: result.val,
            });
        }
    });
}

export function loadAccountTree() {
    return wrap(async dispatch => {
        dispatch({ type: AccountActionType.AccountsLoad, payload: [] });
        const result = await API.accountsTree();
        if (result.ok) {
            dispatch({
                type: AccountActionType.AccountTreeStore,
                payload: { assetTree: result.val.asset, incomeTree: result.val.income, expenseTree: result.val.expense },
            });
        } else {
            dispatch({
                type: AccountActionType.AccountsFailure,
                payload: result.val,
            });
        }
    });
}

export function setFavorite(account: Account, favorite: boolean) {
    return dispatch => {
        const updatedAccount: Account = produce(draft => {
            draft.favorite = favorite;
        })(account);
        dispatch(updateAccount(updatedAccount));
    };
}

export function setOperational(account: Account, operational: boolean) {
    return dispatch => {
        const updatedAccount: Account = produce(draft => {
            draft.operational = operational;
        })(account);
        dispatch(updateAccount(updatedAccount));
    };
}

function updateHidden(account: Account, value: boolean) {
    return dispatch => {
        const updatedAccount: Account = produce(draft => {
            draft.hidden = value;
        })(account);
        dispatch(updateAccount(updatedAccount));
    };
}
export function revealAccount(account: Account) {
    return updateHidden(account, false);
}

export function hideAccount(account: Account) {
    return updateHidden(account, true);
}

export function updateAccount(account: Account) {
    return wrap(async (dispatch, getState: GetStateFunc) => {
        dispatch({ type: AccountActionType.AccountsLoad, payload: [] });

        const state = getState();
        const selectedBudgetId = selectSelectedBudgetId(state);

        const result = await API.saveAccount(account);
        if (result.ok) {
            await dispatch(loadAccountList());
            await dispatch(loadTotalsReport());
            await dispatch(loadCurrentBudget());
            if (selectedBudgetId) {
                await dispatch(loadSelectedBudget(selectedBudgetId));
            }
        } else {
            await dispatch(loadAccountList());
        }
    });
}

export function deleteAccount(account: Account) {
    return wrap(async dispatch => {
        dispatch({ type: AccountActionType.AccountsLoad, payload: [] });

        await API.deleteAccount(account.id);
        await dispatch(loadAccountList());
    });
}
