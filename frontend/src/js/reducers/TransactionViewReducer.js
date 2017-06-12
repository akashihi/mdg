import {
    GET_TRANSACTIONLIST_REQUEST,
    GET_TRANSACTIONLIST_SUCCESS,
    GET_TRANSACTIONLIST_FAILURE,
    SET_TRANSACTION_PAGESIZE,
    GET_TRANSACTION_NEXTPAGE,
    GET_TRANSACTIONLIST_NODATA
} from '../constants/Transaction'

const initialState = {
    transactionList: [],
    ui: {
        transactionListLoading: true,
        transactionListError: false,
        pageSize: 10,
        pageNumber: 1,
        nextPageAvailable: true
    }
};

export default function transactionViewReducer(state = initialState, action) {
    var ui = state.ui;
    switch (action.type) {
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
            ui = {...ui, transactionListLoading: false, transactionListError: false};
            return {...state, transactionList: state.transactionList.concat(action.payload), ui: ui};
        case GET_TRANSACTIONLIST_FAILURE:
            ui = {...ui, transactionListLoading: false, transactionListError: true};
            return {...state, transactionList: [], ui: ui};
        default:
            return state;
    }
}
