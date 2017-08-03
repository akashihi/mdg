import moment from 'moment'

import {
    GET_TRANSACTIONLIST_REQUEST,
    GET_TRANSACTIONLIST_SUCCESS,
    GET_TRANSACTIONLIST_FAILURE,
    SET_TRANSACTION_PAGESIZE,
    SET_TRANSACTION_PAGENO,
    SET_TRANSACTION_VIEW_BEGINNING,
    SET_TRANSACTION_VIEW_END,
    SET_TRANSACTION_VIEW_PERIOD,
    SET_TRANSACTION_FILTER_TAG,
    SET_TRANSACTION_FILTER_ACCOUNT,
    SET_TRANSACTION_FILTER_COMMENT,
    APPLY_TRANSACTION_FILTER,
    CLEAR_TRANSACTION_FILTER
} from '../constants/Transaction'

const initialState = {
    count: 0,
    pageSize: 10,
    pageNumber: 1,
    periodBeginning: moment().subtract(7, 'days'),
    periodEnd: moment(),
    accountFilter: [],
    tagFilter: [],
    commentFilter: ''
};

export default function transactionViewReducer(state = initialState, action) {
    switch (action.type) {
        case APPLY_TRANSACTION_FILTER:
            return {...state, pageNumber: 1};
        case CLEAR_TRANSACTION_FILTER:
            return {...state, accountFilter: [], tagFilter: [], commentFilter: '', pageNumber: 1};
        case SET_TRANSACTION_FILTER_TAG:
            return {...state, tagFilter: action.payload};
        case SET_TRANSACTION_FILTER_ACCOUNT:
            return {...state, accountFilter: action.payload};
        case SET_TRANSACTION_FILTER_COMMENT:
            return {...state, commentFilter: action.payload};
        case SET_TRANSACTION_VIEW_PERIOD:
            return {...state, periodBeginning: action.payload.beginning, periodEnd: action.payload.end, pageNumber: 1};
        case SET_TRANSACTION_VIEW_BEGINNING:
            return {...state, periodBeginning: action.payload};
        case SET_TRANSACTION_VIEW_END:
            return {...state, periodEnd: action.payload};
        case SET_TRANSACTION_PAGENO:
            return {...state, pageNumber: action.payload};
        case SET_TRANSACTION_PAGESIZE:
            return {...state, pageSize: action.payload};
        case GET_TRANSACTIONLIST_REQUEST:
            return {...state, count: 0};
        case GET_TRANSACTIONLIST_SUCCESS:
            return {...state, count: action.payload.count};
        case GET_TRANSACTIONLIST_FAILURE:
            return {...state, count: 0, pageNumber: 1};
        default:
            return state;
    }
}
