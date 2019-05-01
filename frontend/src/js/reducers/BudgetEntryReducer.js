import {
    SET_CURRENT_BUDGET,
    GET_BUDGETENTRYLIST_REQUEST,
    GET_BUDGETENTRYLIST_SUCCESS,
    GET_BUDGETENTRYLIST_FAILURE
} from '../constants/BudgetEntry'

import {
    TOGGLE_HIDDEN_ENTRIES,
} from '../constants/Budget'

const initialState = {
    currentBudget: {
        id: '',
        attributes: {
            incoming_amount: 0,
            outgoing_amount: {
                expected: 0,
                actual: 0
            },
            state: {
                income: {
                    actual: 0,
                    expected: 0
                },
                expense: {
                    actual: 0,
                    expected: 0
                },
                change: {
                    actual: 0,
                    expected: 0
                }
            }
        }
    },
    entryList: [],
    ui: {
        hiddenEntriesVisible: false,
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
        case TOGGLE_HIDDEN_ENTRIES:
            ui = {...ui, hiddenEntriesVisible: action.payload};
            return {...state, ui: ui};
        default:
            return state
    }
}
