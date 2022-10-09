import { Action } from 'redux';
import moment from 'moment';

import { TransactionActionType } from '../constants/Transaction';
import { Transaction } from '../api/models/Transaction';
import { loadAccountList } from './AccountActions';
import { loadTotalsReport } from './ReportActions';
import { loadCurrentBudget, loadSelectedBudget } from './BudgetActions';
import { selectSelectedBudgetId } from '../selectors/BudgetSelector';
import { GetStateFunc } from '../reducers/rootReducer';
import {wrap} from "./base";
import * as API from '../api/api';

export interface TransactionAction extends Action {
    payload: Transaction[];
}

export function loadLastTransactions() {
    return wrap(async dispatch => {
        dispatch({ type: TransactionActionType.TransactionsShortListLoad, payload: [] });

        const periodParams = {
            notLater: moment()
        };

        const result = await API.listTransactions(periodParams, 5)
        if (result.ok) {
            dispatch({ type: TransactionActionType.TransactionsShortListStore, payload: result.val.transactions });
        }
    });
}

export function createTransaction(): TransactionAction {
    return {
        type: TransactionActionType.TransactionCreate,
        payload: [],
    };
}

export function editTransaction(tx: Transaction): TransactionAction {
    return {
        type: TransactionActionType.TransactionEdit,
        payload: [tx],
    };
}

export function closeTransactionDialog(): TransactionAction {
    return {
        type: TransactionActionType.TransactionDialogClose,
        payload: [],
    };
}
export function updateTransaction(tx: Transaction) {
    return wrap(async (dispatch, getState: GetStateFunc) => {
        const result = await API.saveTransaction(tx);
        if (result.ok) {
            await dispatch(loadAccountList());
            await dispatch(loadTotalsReport());
            await dispatch(loadCurrentBudget());
            await dispatch(loadLastTransactions());
            await dispatch(loadSelectedBudget(selectSelectedBudgetId(getState())));
            await dispatch({ type: TransactionActionType.TransactionSave, payload: [tx] });
            await dispatch(createTransaction());

        }
    });
}
