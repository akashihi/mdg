import {OrderedMap, Map} from 'immutable';
import {
    SET_CURRENT_BUDGET,
    GET_BUDGETENTRYLIST_REQUEST,
    GET_BUDGETENTRYLIST_SUCCESS,
    GET_BUDGETENTRYLIST_FAILURE,
    BUDGETENTRY_PARTIAL_UPDATE,
    BUDGETENTRY_PARTIAL_SUCCESS
} from '../constants/BudgetEntry'

import {
    TOGGLE_HIDDEN_ENTRIES,
} from '../constants/Budget'

const initialState = Map({
    currentBudget: Map({
        id: '',
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
    }),
    entryList: OrderedMap(),
    ui: Map({
        hiddenEntriesVisible: false,
        entryListLoading: true,
        entryListError: false
    }),
});

export default function budgetEntryReducer(state = initialState, action) {
    switch (action.type) {
        case GET_BUDGETENTRYLIST_REQUEST:
            return state.setIn(['ui', 'entryListLoading'], true)
                .setIn(['ui', 'entryListError'], false);
        case GET_BUDGETENTRYLIST_SUCCESS:
            return state.setIn(['ui', 'entryListLoading'], false)
                .setIn(['ui', 'entryListError'], false)
                .set('entryList', action.payload);
        case GET_BUDGETENTRYLIST_FAILURE:
            return state.setIn(['ui', 'entryListLoading'], false)
                .setIn(['ui', 'entryListError'], true);
        case BUDGETENTRY_PARTIAL_UPDATE:
        case BUDGETENTRY_PARTIAL_SUCCESS:
            return state.setIn(['entryList', action.payload.id], action.payload.entry)
                .setIn(['ui', 'entryListLoading'], false);
        case SET_CURRENT_BUDGET:
            return state.set('currentBudget', action.payload);
        case TOGGLE_HIDDEN_ENTRIES:
            return state.setIn(['ui', 'hiddenEntriesVisible'], action.payload);
        default:
            return state
    }
}
