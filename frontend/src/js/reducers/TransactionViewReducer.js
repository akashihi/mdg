import {List, Map} from 'immutable';

import moment from 'moment'

import {
    GET_TRANSACTIONLIST_REQUEST,
    GET_TRANSACTIONLIST_SUCCESS,
    GET_TRANSACTIONLIST_FAILURE,
    APPLY_TRANSACTION_FILTER,
    CLEAR_TRANSACTION_FILTER,
    SET_TRANSACTION_FILTER
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
        case SET_TRANSACTION_FILTER:
            return state.set(action.key, action.payload);
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
