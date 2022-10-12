import { produce } from 'immer';
import * as Model from '../api/model';
import moment from 'moment';
import {createAction, createReducer} from "@reduxjs/toolkit";

export const TransactionShortListStore = createAction<Model.Transaction[]>('TransactionShortListStore');
export const TransactionShortListLoad = createAction('TransactionShortListLoad');
export const TransactionCreate = createAction('TransactionCreate');
export const TransactionEdit = createAction<Model.Transaction>('TransactionEdit');
export const TransactionDialogClose = createAction('TransactionDialogClose');
export const TransactionSave = createAction<Model.Transaction>('TransactionSave');

export const DefaultTransaction: Model.EditedTransaction = {
    id: -1,
    timestamp: moment().format('YYYY-MM-DDTHH:mm:ss'),
    comment: '',
    tags: [],
    operations: [
        {
            amount: 0,
            rate: 1,
            account_id: -1,
        },
        {
            amount: 0,
            rate: 1,
            account_id: -1,
        },
    ],
    editedOperations: [
        {
            amount: 0,
            amountValue: '0',
            rate: 1,
            rateValue: '1',
            account_id: -1,
        },
        {
            amount: 0,
            amountValue: '0',
            rate: 1,
            rateValue: '1',
            account_id: -1,
        },
    ],
};

export interface TransactionState {
    lastTransactionList: Model.Transaction[];
    editedTransaction: Model.EditedTransaction;
    savableTransaction?: Model.Transaction;
    transactionDialogVisible: boolean;
}

const initialState: TransactionState = {
    lastTransactionList: [],
    editedTransaction: DefaultTransaction,
    transactionDialogVisible: false,
};

export default createReducer(initialState, builder => {
    builder
        .addCase(TransactionShortListLoad, (state) => {
            state.lastTransactionList = [];
        })
        .addCase(TransactionShortListStore, (state, action) => {
            state.lastTransactionList = action.payload;
        })
        .addCase(TransactionCreate, (state) => {
            state.transactionDialogVisible = true;
            state.editedTransaction = DefaultTransaction;
            state.editedTransaction = produce(state.editedTransaction, txDraft => {
                txDraft.timestamp = moment().format('YYYY-MM-DDTHH:mm:ss');
            });
        })
        .addCase(TransactionEdit, (state, action) => {
            state.transactionDialogVisible = true;
            state.editedTransaction = {
                ...action.payload,
                editedOperations: action.payload.operations.map(o => {
                    return { ...o, amountValue: String(o.amount), rateValue: String(o.rate) };
                }),
            };
        })
        .addCase(TransactionSave, (state, action) => {
            state.savableTransaction = action.payload;
        })
        .addCase(TransactionDialogClose, state => {
            state.transactionDialogVisible = false;
        })
});
