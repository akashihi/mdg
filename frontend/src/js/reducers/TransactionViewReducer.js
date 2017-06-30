import moment from 'moment'

import {
    GET_TRANSACTIONLIST_REQUEST,
    GET_TRANSACTIONLIST_SUCCESS,
    GET_TRANSACTIONLIST_FAILURE,
    SET_TRANSACTION_PAGESIZE,
    GET_TRANSACTION_NEXTPAGE,
    GET_TRANSACTIONLIST_NODATA,
    SET_TRANSACTION_VIEW_PERIOD,
    SET_TRANSACTION_VIEW_BEGINNING,
    SET_TRANSACTION_VIEW_END,
    SET_TRANSACTION_FILTER_ACCOUNT,
    SET_TRANSACTION_FILTER_TAG,
    SET_TRANSACTION_FILTER_COMMENT,
    CLEAR_TRANSACTION_FILTER,
    APPLY_TRANSACTION_FILTER,
    DELETE_TRANSACTION_REQUEST,
    DELETE_TRANSACTION_CANCEL,
    DELETE_TRANSACTION_APPROVE,
    DELETE_TRANSACTION_SUCCESS,
    DELETE_TRANSACTION_FAILURE,
    TRANSACTION_DIALOG_OPEN,
    TRANSACTION_DIALOG_CLOSE,
    TRANSACTION_DIALOG_CHANGE
} from '../constants/Transaction'

const initialState = {
    transactionList: [],
    ui: {
        transactionListLoading: true,
        transactionListError: false,
        pageSize: 10,
        pageNumber: 1,
        nextPageAvailable: true,
        periodBeginning: moment(),
        periodEnd: moment().subtract(7, 'days'),
        accountFilter: [],
        tagFilter: [],
        commentFilter: ''
    },
    delete: {
        transaction: {attributes: {comment: ''}},
        approvementDialogVisible: false,
        loading: false
    },
    dialog: {
        open: false,
        transaction: {attributes: {comment: '', operations: []}}
    }
};

export default function transactionViewReducer(state = initialState, action) {
    var deleteUi = state.delete;
    var dialog = state.dialog;
    var ui = state.ui;
    switch (action.type) {
        case TRANSACTION_DIALOG_CHANGE:
            dialog = {...dialog, transaction: action.payload};
            return {...state, dialog: dialog};
        case TRANSACTION_DIALOG_CLOSE:
            dialog = {...dialog, open: false, transaction: {attributes: {comment: '', operations: []}}};
            return {...state, dialog: dialog};
        case TRANSACTION_DIALOG_OPEN:
            dialog = {...dialog, open: true, transaction: action.payload};
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
        case APPLY_TRANSACTION_FILTER:
            ui = {...ui, pageNumber: 1};
            return {...state, ui: ui, transactionList: []};
        case CLEAR_TRANSACTION_FILTER:
            ui = {...ui, accountFilter: [], tagFilter: [], commentFilter: '', pageNumber: 1};
            return {...state, ui: ui};
        case SET_TRANSACTION_FILTER_TAG:
            ui = {...ui, tagFilter: action.payload};
            return {...state, ui: ui};
        case SET_TRANSACTION_FILTER_ACCOUNT:
            ui = {...ui, accountFilter: action.payload};
            return {...state, ui: ui};
        case SET_TRANSACTION_FILTER_COMMENT:
            ui = {...ui, commentFilter: action.payload};
            return {...state, ui: ui};
        case SET_TRANSACTION_VIEW_BEGINNING:
            ui = {...ui, periodBeginning: action.payload, pageNumber: 1};
            return {...state, ui: ui, transactionList: []};
        case SET_TRANSACTION_VIEW_END:
            ui = {...ui, periodEnd: action.payload, pageNumber: 1};
            return {...state, ui: ui, transactionList: []};
        case SET_TRANSACTION_VIEW_PERIOD:
            ui = {...ui, periodBeginning: action.payload.beginning, periodEnd: action.payload.end, pageNumber: 1};
            return {...state, ui: ui, transactionList: []};
        case GET_TRANSACTIONLIST_NODATA:
            ui = {...ui, nextPageAvailable: false, transactionListLoading: false, transactionListError: false};
            return {...state, ui: ui};
        case GET_TRANSACTION_NEXTPAGE:
            ui = {...ui, pageNumber: ui.pageNumber + 1};
            return {...state, ui: ui};
        case SET_TRANSACTION_PAGESIZE:
            ui = {...ui, pageSize: action.payload, pageNumber: 1, nextPageAvailable: true};
            return {...state, ui: ui, transactionList: []};
        case GET_TRANSACTIONLIST_REQUEST:
            ui = {...ui, transactionListLoading: true, transactionListError: false};
            return {...state, ui: ui};
        case GET_TRANSACTIONLIST_SUCCESS:
            ui = {...ui, transactionListLoading: false, transactionListError: false, nextPageAvailable: true};
            return {...state, transactionList: state.transactionList.concat(action.payload), ui: ui};
        case GET_TRANSACTIONLIST_FAILURE:
            ui = {...ui, transactionListLoading: false, transactionListError: true};
            return {...state, transactionList: [], ui: ui};
        default:
            return state;
    }
}
