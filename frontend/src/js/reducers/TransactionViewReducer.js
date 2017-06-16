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
    SET_TRANSACTION_FILTER_TAG
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
        tagFilter: []
    }
};

export default function transactionViewReducer(state = initialState, action) {
    var ui = state.ui;
    switch (action.type) {
        case SET_TRANSACTION_FILTER_TAG:
            ui = {...ui, tagFilter: action.payload};
            return {...state, ui: ui};
        case SET_TRANSACTION_FILTER_ACCOUNT:
            ui = {...ui, accountFilter: action.payload};
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
            ui = {...ui, pageNumber: ui.pageNumber+1};
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
