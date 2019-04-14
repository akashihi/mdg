import {List, Map} from 'immutable';

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

const initialState = Map({
    count: 0,
    pageSize: 10,
    pageNumber: 1,
    periodBeginning: moment().subtract(7, 'days'),
    periodEnd: moment(),
    accountFilter: List(),
    tagFilter: List(),
    commentFilter: ''
});

export default function transactionViewReducer(state = initialState, action) {
    switch (action.type) {
        case APPLY_TRANSACTION_FILTER:
          return state.set('pageNumber', 1);
        case CLEAR_TRANSACTION_FILTER:
          return state.set('accountFilter', List())
            .set('tagFilter', List())
            .set('commentFilter', '')
            .set('pageNumber', 1);
        case SET_TRANSACTION_FILTER_TAG:
          return state.set('tagFilter', action.payload);
        case SET_TRANSACTION_FILTER_ACCOUNT:
          return state.set('accountFilter', action.payload);
        case SET_TRANSACTION_FILTER_COMMENT:
          return state.set('commentFilter', action.payload);
        case SET_TRANSACTION_VIEW_PERIOD:
          return state.set('periodBeginning', action.payload.beginning)
            .set('periodEnd', action.payload.end)
            .set('pageNumber', 1);
        case SET_TRANSACTION_VIEW_BEGINNING:
          return state.set('periodBeginning', action.payload);
        case SET_TRANSACTION_VIEW_END:
          return state.set('periodEnd', action.payload);
        case SET_TRANSACTION_PAGENO:
          return state.set('pageNumber', action.payload);
        case SET_TRANSACTION_PAGESIZE:
          return state.set('pageSize', action.payload);
        case GET_TRANSACTIONLIST_REQUEST:
          return state.set('count', 0);
        case GET_TRANSACTIONLIST_SUCCESS:
          return state.set('count', action.payload.count);
        case GET_TRANSACTIONLIST_FAILURE:
          return state.set('count', 0)
            .set('pageNumber', 1);
        default:
            return state;
    }
}
