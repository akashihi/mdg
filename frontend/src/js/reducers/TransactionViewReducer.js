import {
    GET_TRANSACTIONLIST_REQUEST,
    GET_TRANSACTIONLIST_SUCCESS,
    GET_TRANSACTIONLIST_FAILURE,
    SET_TRANSACTION_PAGESIZE,
    SET_TRANSACTION_PAGENO
} from '../constants/Transaction'

const initialState = {
    count: 0,
    pageSize: 10,
    pageNumber: 1
};

export default function transactionViewReducer(state = initialState, action) {
    switch (action.type) {
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
