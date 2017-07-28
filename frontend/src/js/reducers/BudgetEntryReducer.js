import {
    SET_CURRENT_BUDGET,
    GET_BUDGETENTRYLIST_REQUEST,
    GET_BUDGETENTRYLIST_SUCCESS,
    GET_BUDGETENTRYLIST_FAILURE
} from '../constants/BudgetEntry'

const initialState = {
    currentBudget: {
        attributes: {
            incoming_amount: 0,
            outgoing_amount: {
                expected: 0,
                actual: 0
            }
        }
    },
    entryList: [],
    ui: {
        hiddenAccountsVisible: false,
        entryListLoading: true,
        entryListError: false
    },
};

export default function budgetEntryReducer(state = initialState, action) {
    var ui = state.ui;
    switch (action.type) {
        case GET_BUDGETENTRYLIST_REQUEST:
            ui = {...ui, entryListLoading: true, entryListError: false};
            return {...state, ui: ui};
        case GET_BUDGETENTRYLIST_SUCCESS:
            ui = {...ui, entryListLoading: false, entryListError: false};
            return {...state, entryList: action.payload, ui: ui};
        case GET_BUDGETENTRYLIST_FAILURE:
            ui = {...ui, entryListLoading: false, entryListError: true};
            return {...state, entryList: [], ui: ui};
        case SET_CURRENT_BUDGET:
            return {...state, currentBudget: action.payload};
        default:
            return state
    }
}
