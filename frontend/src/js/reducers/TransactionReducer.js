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

const initialState = {
    transactionList: [],
    lastTransactionList: [],
    ui: {
        transactionListLoading: true,
        transactionListError: false,
    },
    delete: {
        transaction: {attributes: {comment: ''}},
        approvementDialogVisible: false,
        loading: false
    },
    dialog: {
        open: false,
        closeOnSave: false,
        transaction: {attributes: {comment: '', tags: [], operations: [ {amount: 0}, {amount: 0}]}},
        valid: false,
        errors: { operations: [{}, {}]}
    }
};

function validateTransactionForm(tx) {
    var attributes = tx.attributes;
    var errors = {};
    var operationErrors = [];

    var easeForMultiCurrency = false;

    var valid = true;

    attributes.operations.forEach((item) => {
        var operationError = {};

        if (!/^-?(0|[1-9]\d*)\.?\d{0,2}?$/.test(item.amount)) {
            operationError.amount = 'Amount is invalid';
            valid = false;
        }

        if (!item.account_id) {
            operationError.account_id = 'Account is not selected';
            valid = false;
        }

        operationErrors.push(operationError);
    });
    errors.operations = operationErrors;


    var ops = attributes.operations.filter((item) => parseFloat(item.amount) !=0);
    if (ops.length == 0 ) {
        errors.transaction = 'Empty transaction';
        valid = false;
    }
    var sum = ops.reduce((acc, item) => {
      var amount = parseFloat(item.amount)
      if (item.rate) {
        easeForMultiCurrency = true
        amount = amount * parseFloat(item.rate)
      }
      return acc+amount
    }, 0);
    if ( !(-1 < sum && sum < 1) || ( sum!= 0 && !easeForMultiCurrency)) {
        errors.transaction = 'Transaction not balanced';
        valid = false;
    }

    return {valid: valid, errors: errors}
}

export default function transactionReducer(state = initialState, action) {
    var deleteUi = state.delete;
    var dialog = state.dialog;
    var ui = state.ui;
    switch (action.type) {
        case GET_LASTTRANSACTION_SUCCESS:
            return {...state, lastTransactionList: action.payload};
        case TRANSACTION_DIALOG_CHANGE:
            var valid = validateTransactionForm(action.payload);
            dialog = {...dialog, transaction: action.payload, valid: valid.valid, errors: valid.errors};
            return {...state, dialog: dialog};
        case TRANSACTION_DIALOG_CLOSE:
            dialog = {...dialog, open: false};
            return {...state, dialog: dialog};
        case TRANSACTION_DIALOG_OPEN:
            var validInitial = validateTransactionForm(action.payload);
            dialog = {...dialog, open: true, transaction: action.payload, valid: validInitial.valid, errors: validInitial.errors};
            dialog = {...dialog, open: true, transaction: action.payload};
            return {...state, dialog: dialog};
        case TRANSACTION_DIALOG_CLOSESAVE_SET:
            dialog = {...dialog, closeOnSave: action.payload};
            return {...state, dialog: dialog};
       case GET_SETTING_SUCCESS:
            var closeTransactionDialogObject = action.payload.filter((item) => item.id == 'ui.transaction.closedialog')[0]
            var closeTransactionDialog = closeTransactionDialogObject.attributes.value === 'true'

            dialog = {...dialog, closeOnSave: closeTransactionDialog};
            return {...state, dialog: dialog};
        case DELETE_TRANSACTION_REQUEST:
            deleteUi = {...deleteUi, approvementDialogVisible: true, transaction: action.payload};
            return {...state, delete: deleteUi};
        case DELETE_TRANSACTION_CANCEL:
            deleteUi = {...deleteUi, approvementDialogVisible: false, transaction: {attributes: {comment: ''}}};
            return {...state, delete: deleteUi};
        case DELETE_TRANSACTION_APPROVE:
            deleteUi = {...deleteUi, loading: true};
            return {...state, delete: deleteUi};
        case DELETE_TRANSACTION_FAILURE:
            deleteUi = {...deleteUi, loading: false};
            return {...state, delete: deleteUi};
        case DELETE_TRANSACTION_SUCCESS:
            var deletedTransactionIndex = state.transactionList.map((i) => i.id).indexOf(action.payload.id);
            var listToClean = state.transactionList.slice();
            listToClean.splice(deletedTransactionIndex, 1);
            deleteUi = {...deleteUi, approvementDialogVisible: false, loading: false, transaction: {attributes: {comment: ''}}};
            return {...state, delete: deleteUi, transactionList: listToClean};
        case GET_TRANSACTIONLIST_REQUEST:
            ui = {...ui, transactionListLoading: true, transactionListError: false};
            return {...state, ui: ui};
        case GET_TRANSACTIONLIST_SUCCESS:
            ui = {...ui, transactionListLoading: false, transactionListError: false};
            return {...state, transactionList: action.payload.data, ui: ui};
        case GET_TRANSACTIONLIST_FAILURE:
            ui = {...ui, transactionListLoading: false, transactionListError: true};
            return {...state, transactionList: [], ui: ui};
        default:
            return state;
    }
}
