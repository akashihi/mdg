import { produce } from 'immer';
import * as API from '../api/api';
import { loadCurrentBudget, loadSelectedBudget } from './BudgetActions';
import { loadTotalsReport } from './ReportActions';

import { Account } from '../api/models/Account';
import { GetStateFunc } from '../reducers/rootReducer';
import { selectSelectedBudgetId } from '../selectors/BudgetSelector';
import { wrap } from './base';
import {AccountsLoad, AccountsStore, AccountTreeStore} from "../reducers/AccountReducer";
import {NotifyError} from "../reducers/ErrorReducer";

export function loadAccountList() {
    return wrap(async dispatch => {
        dispatch(AccountsLoad());

        const result = await API.listAccounts();

        if (result.ok) {
            dispatch(AccountsStore(result.val));
            await dispatch(loadAccountTree());
        } else {
            dispatch(NotifyError(result.val));
        }
    });
}

export function loadAccountTree() {
    return wrap(async dispatch => {
        dispatch(AccountsLoad());
        const result = await API.accountsTree();
        if (result.ok) {
            dispatch(AccountTreeStore({
                assetTree: result.val.asset,
                incomeTree: result.val.income,
                expenseTree: result.val.expense,
            }))
        } else {
            dispatch(NotifyError(result.val));
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
        dispatch(AccountsLoad());

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
            dispatch(NotifyError(result.val));
            await dispatch(loadAccountList());
        }
    });
}

export function deleteAccount(account: Account) {
    return wrap(async dispatch => {
        dispatch(AccountsLoad());

        await API.deleteAccount(account.id);
        await dispatch(loadAccountList());
    });
}
