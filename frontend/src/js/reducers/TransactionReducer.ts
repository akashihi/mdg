import {produce} from 'immer';
import {TransactionActionType} from '../constants/Transaction'
import {Transaction} from "../models/Transaction";
import {TransactionAction} from "../actions/TransactionActions";
import moment from 'moment';

export const DefaultTransaction: Transaction = {
    id: -1,
    timestamp: moment().format('YYYY-MM-DDTHH:mm:ss'),
    operations: [
        {
            amount: 0,
            account_id: -1
        },
        {
            amount: 0,
            account_id: -1
        }
    ]
}

export interface TransactionState {
    lastTransactionList: Transaction[];
    editedTransaction: Transaction;
    transactionDialogVisible: boolean;
}

const initialState: TransactionState = {
    lastTransactionList: [],
    editedTransaction: DefaultTransaction,
    transactionDialogVisible: false
}

/*const initialState = Map({
  transactionList: OrderedMap(),
  lastTransactionList: OrderedMap(),
  ui: Map({
    transactionListLoading: true,
    transactionListError: false
  }),
  delete: Map({
    id: '',
    approvementDialogVisible: false,
    loading: false
  }),
  dialog: Map({
    open: false,
    closeOnSave: false,
    id: -1,
    transaction: Map({ comment: '', tags: [], operations: [{ amount: 0 }, { amount: 0 }] }),
    valid: false,
    errors: Map({ valid: true, errors: List(), operations: List() })
  })
})*/

export default function transactionReducer(state: TransactionState = initialState, action: TransactionAction) {
    switch (action.type) {
        case TransactionActionType.TransactionsShortListStore:
            return produce(state, draft => {draft.lastTransactionList = action.payload});
        case TransactionActionType.TransactionsShortListLoad:
            return produce(state, draft => {draft.lastTransactionList = []});
        case TransactionActionType.TransactionCreate:
            return produce(state, draft => {draft.transactionDialogVisible = true; draft.editedTransaction = DefaultTransaction})
        case TransactionActionType.TransactionEdit:
            return produce(state, draft => {draft.transactionDialogVisible = true; draft.editedTransaction = action.payload[0]})
        case TransactionActionType.TransactionDialogClose:
            return produce(state, draft => {draft.transactionDialogVisible = false})
        /*case TRANSACTION_DIALOG_CHANGE:
          var valid = validateTransactionForm(action.payload)
          return state.setIn(['dialog', 'transaction'], action.payload)
            .setIn(['dialog', 'valid'], valid.get('valid'))
            .setIn(['dialog', 'errors'], valid.get('errors'))
        case TRANSACTION_DIALOG_CLOSE:
          return state.setIn(['dialog', 'open'], false)
        case TRANSACTION_DIALOG_OPEN:
          var validInitial = validateTransactionForm(action.payload.tx)
          return state.setIn(['dialog', 'transaction'], action.payload.tx)
            .setIn(['dialog', 'id'], action.payload.id)
            .setIn(['dialog', 'open'], true)
            .setIn(['dialog', 'valid'], validInitial.get('valid'))
            .setIn(['dialog', 'errors'], validInitial.get('errors'))
        case TRANSACTION_DIALOG_CLOSESAVE_SET:
          return state.setIn(['dialog', 'closeOnSave'], action.payload)
        case DELETE_TRANSACTION_APPROVE:
        case TRANSACTION_PARTIAL_UPDATE:
        case TRANSACTION_PARTIAL_SUCCESS:
          return state.setIn(['transactionList', action.payload.id], action.payload.tx)
            .setIn(['ui', 'transactionListLoading'], false)
            .setIn(['delete', 'approvementDialogVisible'], false)
        case GET_SETTING_SUCCESS:
          var closeTransactionDialog = action.payload.get('ui.transaction.closedialog').get('value') === 'true'
          return state.setIn(['dialog', 'closeOnSave'], closeTransactionDialog)
        case GET_TRANSACTIONLIST_REQUEST:
          return state.setIn(['ui', 'transactionListLoading'], true)
            .setIn(['ui', 'transactionListError'], false)
        case GET_TRANSACTIONLIST_SUCCESS:
          return state.setIn(['ui', 'transactionListLoading'], false)
            .setIn(['ui', 'transactionListError'], false)
            .set('transactionList', action.payload)
        case GET_TRANSACTIONLIST_FAILURE:
          return state.setIn(['ui', 'transactionListLoading'], false)
            .setIn(['ui', 'transactionListError'], true)*/
        default:
            return state
    }
}
