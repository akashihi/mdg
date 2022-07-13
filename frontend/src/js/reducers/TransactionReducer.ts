import {produce} from 'immer';
import {TransactionActionType} from '../constants/Transaction'
import {EditedTransaction, Transaction} from "../models/Transaction";
import {TransactionAction} from "../actions/TransactionActions";
import moment from 'moment';

export const DefaultTransaction: EditedTransaction = {
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
        }
    ],
    editedOperations:[
        {
            amount: 0,
            amountValue: "0",
            rate: 1,
            rateValue: "1",
            account_id: -1,
        },
        {
            amount: 0,
            amountValue: "0",
            rate: 1,
            rateValue: "1",
            account_id: -1,
        }
    ]
}

export interface TransactionState {
    lastTransactionList: Transaction[];
    editedTransaction: EditedTransaction;
    savableTransaction?: Transaction;
    transactionDialogVisible: boolean;
}

const initialState: TransactionState = {
    lastTransactionList: [],
    editedTransaction: DefaultTransaction,
    transactionDialogVisible: false
}

export default function transactionReducer(state: TransactionState = initialState, action: TransactionAction) {
    switch (action.type) {
        case TransactionActionType.TransactionsShortListStore:
            return produce(state, draft => {draft.lastTransactionList = action.payload});
        case TransactionActionType.TransactionsShortListLoad:
            return produce(state, draft => {draft.lastTransactionList = []});
        case TransactionActionType.TransactionCreate:
            return produce(state, draft => {draft.transactionDialogVisible = true; draft.editedTransaction = DefaultTransaction})
        case TransactionActionType.TransactionEdit:
            return produce(state, draft => {
                draft.transactionDialogVisible = true; draft.editedTransaction = {
                    ...action.payload[0],
                    editedOperations: action.payload[0].operations.map(o=> {return {...o, amountValue: String(o.amount), rateValue: String(o.rate)}})
                }
            })
        case TransactionActionType.TransactionDialogClose:
            return produce(state, draft => {draft.transactionDialogVisible = false})
        case TransactionActionType.TransactionSave:
            return produce(state, draft => {
                draft.savableTransaction = action.payload[0];
            })
        default:
            return state
    }
}
