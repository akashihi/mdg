import {OrderedMap, Map, List} from 'immutable';
import mathjs from 'mathjs'
import {
    GET_TRANSACTIONLIST_REQUEST,
    GET_TRANSACTIONLIST_SUCCESS,
    GET_TRANSACTIONLIST_FAILURE,
    DELETE_TRANSACTION_REQUEST,
    DELETE_TRANSACTION_CANCEL,
    DELETE_TRANSACTION_APPROVE,
    DELETE_TRANSACTION_SUCCESS,
    DELETE_TRANSACTION_FAILURE,
    TRANSACTION_DIALOG_OPEN,
    TRANSACTION_DIALOG_CLOSE,
    TRANSACTION_DIALOG_CHANGE,
    TRANSACTION_DIALOG_CLOSESAVE_SET,
    GET_LASTTRANSACTION_SUCCESS
} from '../constants/Transaction'
import {GET_SETTING_SUCCESS} from '../constants/Setting'

const initialState = Map({
    transactionList: OrderedMap(),
    lastTransactionList: OrderedMap(),
    ui: Map({
        transactionListLoading: true,
        transactionListError: false,
    }),
    delete: Map({
        transaction: Map({comment: ''}),
        approvementDialogVisible: false,
        loading: false
    }),
    dialog: Map({
        open: false,
        closeOnSave: false,
        transaction: Map({comment: '', tags: [], operations: [{amount: 0}, {amount: 0}]}),
        valid: false,
        errors: Map({valid: true, errors: List(), operations: List()})
    })
});

function validateTransactionForm(tx) {
    var errors = Map();
    var operationErrors = List();

    var easeForMultiCurrency = false;

    var valid = true;

    tx.get('operations').forEach((item) => {
        var operationError = Map();

        if (item.amount) {
            var strAmount = item.amount.toString();
            if (strAmount.slice(-1) === '=') { //If it ends with =
                var expr = strAmount.slice(0, -1); //Strip the = and evaluate mathematical expression
                try {
                    item.amount = mathjs.eval(expr)
                } catch (e) {
                    item.amount = expr
                }
            }
        }

        if (!/^-?(0|[1-9]\d*)\.?\d{0,2}?$/.test(item.amount)) {
            operationError = operationError.set('amount', 'Amount is invalid');
            valid = false;
        }

        if (!item.account_id) {
            operationError = operationError.set(['account_id'], 'Account is not selected');
            valid = false;
        }

        operationErrors.push(operationError);
    });
    errors = errors.set('operations', operationErrors);


    var ops = tx.get('operations').filter((item) => parseFloat(item.amount) !== 0);
    if (ops.length === 0) {
        errors.set('transaction', 'Empty transaction');
        valid = false;
    }
    var sum = ops.reduce((acc, item) => {
        var amount = parseFloat(item.amount);
        if (item.rate) {
            easeForMultiCurrency = true;
            amount = amount * parseFloat(item.rate)
        }
        return acc + amount
    }, 0);
    if (!(-1 < sum && sum < 1) || (sum !== 0 && !easeForMultiCurrency)) {
        errors.set('transaction', 'Transaction not balanced');
        valid = false;
    }

    return Map({valid: valid, errors: errors})
}

export default function transactionReducer(state = initialState, action) {
    switch (action.type) {
        case GET_LASTTRANSACTION_SUCCESS:
            return state.set('lastTransactionList', action.payload);
        case TRANSACTION_DIALOG_CHANGE:
            var valid = validateTransactionForm(action.payload);
            return state.setIn(['dialog', 'transaction'], action.payload)
                .setIn(['dialog', 'valid'], valid.get('valid'))
                .setIn(['dialog', 'errors'], valid.get('errors'));
        case TRANSACTION_DIALOG_CLOSE:
            return state.setIn(['dialog', 'open'], false);
        case TRANSACTION_DIALOG_OPEN:
            var validInitial = validateTransactionForm(action.payload);
            return state.setIn(['dialog', 'transaction'], action.payload)
                .setIn(['dialog', 'open'], true)
                .setIn(['dialog', 'valid'], validInitial.get('valid'))
                .setIn(['dialog', 'errors'], validInitial.get('errors'));
        case TRANSACTION_DIALOG_CLOSESAVE_SET:
            return state.setIn(['dialog', 'closeOnSave'], action.payload);
        case GET_SETTING_SUCCESS:
            var closeTransactionDialog = action.payload.get('ui.transaction.closedialog').get('value') === 'true';
            return state.setIn(['dialog', 'closeOnSave'], closeTransactionDialog);
        case DELETE_TRANSACTION_REQUEST:
            return state.setIn(['delete', 'approvementDialogVisible'], true)
                .setIn(['delete', 'transaction'], action.payload);
        case DELETE_TRANSACTION_CANCEL:
            return state.setIn(['delete', 'approvementDialogVisible'], false)
                .setIn(['delete', 'transaction'], Map({comment: ''}));
        case DELETE_TRANSACTION_APPROVE:
            return state.setIn(['delete', 'loading'], true);
        case DELETE_TRANSACTION_FAILURE:
            return state.setIn(['delete', 'loading'], false);
        case DELETE_TRANSACTION_SUCCESS:
            var removed = state.get('transactionList').remove(action.payload.id);
            return state.setIn(['delete', 'approvementDialogVisible'], false)
                .setIn(['delete', 'loading'], false)
                .setIn(['delete', 'transaction'], Map({comment: ''}))
                .set('transactionList', removed);
        case GET_TRANSACTIONLIST_REQUEST:
            return state.setIn(['ui', 'transactionListLoading'], true)
                .setIn(['ui', 'transactionListError'], false);
        case GET_TRANSACTIONLIST_SUCCESS:
            return state.setIn(['ui', 'transactionListLoading'], false)
                .setIn(['ui', 'transactionListError'], false)
                .set('transactionList', action.payload);
        case GET_TRANSACTIONLIST_FAILURE:
            return state.setIn(['ui', 'transactionListLoading'], false)
                .setIn(['ui', 'transactionListError'], true);
        default:
            return state;
    }
}
