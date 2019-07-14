import {OrderedMap, Map} from 'immutable';
import {
    GET_BUDGETLIST_REQUEST,
    GET_BUDGETLIST_SUCCESS,
    GET_BUDGETLIST_FAILURE,
} from '../constants/Budget'

import {
    SET_CURRENT_BUDGET,
    GET_BUDGETENTRYLIST_REQUEST,
    GET_BUDGETENTRYLIST_SUCCESS
} from '../constants/BudgetEntry'

const initialState = Map({
    ui: Map({
        budgetListLoading: false,
        budgetListError: false
    }),
    budgetList: OrderedMap()
});

export default function budgetSelector(state = initialState, action) {
    switch (action.type) {
        case GET_BUDGETENTRYLIST_REQUEST:
            return state.setIn(['ui', 'budgetListLoading'], true);
        case GET_BUDGETENTRYLIST_SUCCESS:
        case SET_CURRENT_BUDGET:
            return state.setIn(['ui', 'budgetListLoading'], false);
        case GET_BUDGETLIST_REQUEST:
            return state.setIn(['ui', 'budgetListLoading'], true)
                .setIn(['ui', 'budgetListError'], false);
        case GET_BUDGETLIST_SUCCESS:
            return state.setIn(['ui', 'budgetListLoading'], false)
                .setIn(['ui', 'budgetListError'], false)
                .set('budgetList', action.payload);
        case GET_BUDGETLIST_FAILURE:
            return state.setIn(['ui', 'budgetListLoading'], false)
                .setIn(['ui', 'budgetListError'], true)
                .set('budgetList', OrderedMap());
        default:
            return state
    }
}
