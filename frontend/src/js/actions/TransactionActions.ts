import moment from 'moment';

import { Transaction } from '../api/models/Transaction';
import { loadAccountList } from './AccountActions';
import { loadTotalsReport } from './ReportActions';
import { loadCurrentBudget, loadSelectedBudget } from './BudgetActions';
import { selectSelectedBudgetId } from '../selectors/BudgetSelector';
import { GetStateFunc } from '../reducers/rootReducer';
import { wrap } from './base';
import * as API from '../api/api';
import {
    TransactionCreate,
    TransactionDialogClose,
    TransactionEdit,
    TransactionSave,
    TransactionShortListLoad,
    TransactionShortListStore,
} from '../reducers/TransactionReducer';
import { NotifyError } from '../reducers/ErrorReducer';

export function loadLastTransactions() {
    return wrap(async dispatch => {
        dispatch(TransactionShortListLoad);

        const periodParams = {
            notLater: moment(),
        };

        const result = await API.listTransactions(periodParams, 5);
        if (result.ok) {
            dispatch(TransactionShortListStore(result.val.transactions));
        } else {
            dispatch(NotifyError(result.val));
        }
    });
}

export function createTransaction() {
    return TransactionCreate();
}

export function editTransaction(tx: Transaction) {
    return TransactionEdit(tx);
}

export function closeTransactionDialog() {
    return TransactionDialogClose();
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
            dispatch(TransactionSave(tx));
            await dispatch(createTransaction());
        }
    });
}
