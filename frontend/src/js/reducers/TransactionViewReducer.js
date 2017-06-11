import {
    GET_TRANSACTIONLIST_REQUEST,
    GET_TRANSACTIONLIST_SUCCESS,
    GET_TRANSACTIONLIST_FAILURE,
    SET_TRANSACTION_PAGESIZE
} from '../constants/Transaction'

const initialState = {
    transactionList: [],
    ui: {
        transactionListLoading: true,
        transactionListError: false,
        pageSize: 10
    }
};

export default function transactionViewReducer(state = initialState, action) {
    var ui = state.ui;
    switch (action.type) {
        case SET_TRANSACTION_PAGESIZE:
            ui = {...ui, pageSize: action.payload};
            return {...state, ui: ui};
        case GET_TRANSACTIONLIST_REQUEST:
            ui = {...ui, transactionListLoading: true, transactionListError: false};
            return {...state, ui: ui};
        case GET_TRANSACTIONLIST_SUCCESS:
            ui = {...ui, transactionListLoading: false, transactionListError: false};
            return {...state, transactionList: action.payload, ui: ui};
        case GET_TRANSACTIONLIST_FAILURE:
            ui = {...ui, transactionListLoading: false, transactionListError: true};
            return {...state, transactionList: [], ui: ui};
        default:
            return state;
    }
}
